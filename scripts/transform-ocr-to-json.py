"""
transform-ocr-to-json.py
Fase 3 do pipeline: converte indice-remissivo-bruto.txt em JSON
para importação na extensão "Busca Rápida de Leis".

COMO USAR:
    python scripts/transform-ocr-to-json.py

O arquivo gerado (data/indice-remissivo.json) pode ser colado
diretamente no campo "Importar Dados da IA" na aba Gerenciar.
"""

import json
import re

INPUT_FILE = (
    r"C:\Users\AlvaroSouzaJr\OneDrive - Macher Serviços em Tecnologia LTDA"
    r"\Documentos\Pessoal\Claude-projects\Meu Vade Mecum\data\indice-remissivo-bruto.txt"
)
OUTPUT_FILE = (
    r"C:\Users\AlvaroSouzaJr\OneDrive - Macher Serviços em Tecnologia LTDA"
    r"\Documentos\Pessoal\Claude-projects\Meu Vade Mecum\data\indice-remissivo.json"
)
OUTPUT_OAB_FILE = (
    r"C:\Users\AlvaroSouzaJr\OneDrive - Macher Serviços em Tecnologia LTDA"
    r"\Documentos\Pessoal\Claude-projects\Meu Vade Mecum\data\indice-remissivo-oab.json"
)

ETIQUETA = "ÍNDICE CF/CP/CPP"

# ─────────────────────────────────────────────
# Mapeamento de expressões → sigla de lei
# ─────────────────────────────────────────────
LAW_RULES = [
    (r'\bdo\s+CPP\b',                   'CPP'),
    (r'\bdo\s+CPM\b',                   'CPM'),
    (r'\bda\s+CF\b',                    'CF'),
    (r'\bdo\s+ADCT\b',                  'CF'),   # ADCT integra a CF
    (r'\bdo\s+CTB\b',                   'CTB'),
    (r'\bda\s+LEP\b',                   'LEP'),
    (r'\bdo\s+CP\b',                    'CP'),
    (r'\bdo\s+STF\b',                   'STF'),
    (r'\bdo\s+STJ\b',                   'STJ'),
    (r'\bdo\s+STM\b',                   'STM'),
    (r'\bdo\s+TFR\b',                   'TFR'),
    (r'\bdo\s+TRF\b',                   'TRF'),
    (r'\bdo\s+Cód\.\s*Ética\s+OAB\b',  'OAB'),
    (r'\bda\s+OAB\b',                   'OAB'),
]


def identify_law(text):
    for pattern, law in LAW_RULES:
        if re.search(pattern, text, re.IGNORECASE):
            return law
    # Leis extravagantes: "Lei 9.455/1997", "LC 105/2001", "Dec. 6.488/2008"
    m = re.search(r'\b(Lei\s+[\d\.]+/\d+|LC\s+[\d\.]+(?:/\d+)?|Dec\.\s+[\d\.]+(?:/\d+)?)', text)
    if m:
        return m.group(1).strip()
    return None


def extract_articles(text):
    """Retorna lista de artigos/súmulas extraídos do trecho de referência."""
    articles = []

    # Súmulas vinculantes: "SV 45", "SV 56"
    for m in re.finditer(r'\bSV\s+(\d+)', text):
        articles.append(f'SV {m.group(1)}')

    # Súmulas STF/STJ/TFR: "Súm. 442, 443, 582"
    for m in re.finditer(r'Súm\.\s*([\d,\s]+)', text):
        for n in re.findall(r'\d+', m.group(1)):
            articles.append(f'Súm. {n}')

    if articles:
        return articles

    ART = r'\d+(?:-[A-Z])?'  # ex: "28", "168-A", "337-B"

    # Faixa de artigos: "arts. 77 a 82" ou "arts. 337-A a 337-D"
    m = re.search(rf'arts?\.\s*({ART})\s+a\s+({ART})', text)
    if m:
        a1, a2 = m.group(1), m.group(2)
        if a1.isdigit() and a2.isdigit():
            start, end = int(a1), int(a2)
            if end - start <= 30:
                return [str(n) for n in range(start, end + 1)]
            return [f'{start}-{end}']
        return [f'{a1} a {a2}']  # faixa com letra: "337-A a 337-D"

    # Múltiplos artigos: "arts. 77, 78, 82" ou "arts. 313-A, 313-B"
    m = re.search(rf'arts?\.\s*((?:{ART},?\s*)+)', text)
    if m:
        nums = re.findall(ART, m.group(1))
        if nums:
            return nums

    # Artigo único: "art. 157" ou "art. 168-A"
    m = re.search(rf'art\.\s*({ART})', text)
    if m:
        return [m.group(1)]

    return []


def is_main_heading(line):
    """Retorna True se a linha for um cabeçalho de termo principal."""
    s = line.strip()
    if not s:
        return False
    if s.startswith('•'):
        return False
    if re.match(r'^\[', s):        # [PÁGINA...] ou [FIM...]
        return False
    if re.match(r'^-\s+\w', s):   # "- S -"
        return False
    # Considera cabeçalho se ≥ 70% dos caracteres alfabéticos forem maiúsculos
    alpha = re.sub(r'[^A-ZÀ-Úa-zà-ú]', '', s)
    if not alpha:
        return False
    upper = sum(1 for c in alpha if c.isupper())
    return (upper / len(alpha)) >= 0.70 and len(s) >= 2


def parse_bullet(content, current_term):
    """
    Dado o conteúdo de um bullet (sem o •), retorna lista de entradas JSON.
    Divide em múltiplas entradas quando há referências a leis diferentes.
    """
    # "Vide X" → entrada informacional
    vide = re.match(r'^[Vv]ide\s+(.+)$', content)
    if vide:
        return [{
            "termo": current_term,
            "etiqueta": ETIQUETA,
            "lei": "",
            "artigos": [f"Vide {vide.group(1).strip()}"]
        }]

    # Separa sub-descrição da referência: "sub desc: art. X, do CP"
    sub_desc = None
    refs_text = content
    colon = content.find(':')
    if colon > 0:
        before = content[:colon].strip()
        after  = content[colon + 1:].strip()
        # Só é sub-descrição se não começar com palavra-chave de referência
        if not re.match(r'^(arts?|Súm|SV|Lei|LC|Dec)\.?\s', before, re.IGNORECASE):
            sub_desc = before
            refs_text = after

    termo = f"{current_term} > {sub_desc}" if sub_desc else current_term

    # Divide referências por ";" para separar leis diferentes
    entries = []
    for part in re.split(r';\s*', refs_text):
        part = part.strip()
        if not part:
            continue
        law      = identify_law(part)
        articles = extract_articles(part)

        if not law and not articles:
            continue  # referência não reconhecida — pula

        entries.append({
            "termo":    termo,
            "etiqueta": ETIQUETA,
            "lei":      law or "",
            "artigos":  articles
        })

    return entries


# ─────────────────────────────────────────────
# Leitura e transformação
# ─────────────────────────────────────────────
def main():
    with open(INPUT_FILE, encoding='utf-8') as f:
        lines = f.readlines()

    result        = []
    current_term  = None
    skipped       = 0
    total_bullets = 0

    for raw_line in lines:
        line = raw_line.rstrip('\n')
        stripped = line.strip()

        if not stripped:
            continue
        if re.match(r'^\[PÁGINA \d+\]$', stripped):
            continue
        if re.match(r'^-\s+\w.*-\s*$', stripped):   # "- S -"
            continue
        if stripped.startswith('[FIM'):
            continue

        if is_main_heading(stripped):
            current_term = stripped
            continue

        if stripped.startswith('•') and current_term:
            total_bullets += 1
            content = stripped[1:].strip()
            entries = parse_bullet(content, current_term)
            if entries:
                result.extend(entries)
            else:
                skipped += 1

    oab     = [e for e in result if e['lei'] == 'OAB']
    restante = [e for e in result if e['lei'] != 'OAB']

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(restante, f, ensure_ascii=False, indent=2)

    with open(OUTPUT_OAB_FILE, 'w', encoding='utf-8') as f:
        json.dump(oab, f, ensure_ascii=False, indent=2)

    print("=" * 55)
    print("  Fase 3 - Transformacao OCR para JSON concluida")
    print("=" * 55)
    print(f"  Bullets processados : {total_bullets}")
    print(f"  Entradas geradas    : {len(restante)}  (indice-remissivo.json)")
    print(f"  Entradas OAB        : {len(oab)}  (indice-remissivo-oab.json)")
    print(f"  Bullets ignorados   : {skipped}  (referências não reconhecidas)")
    print("=" * 55)


if __name__ == "__main__":
    main()
