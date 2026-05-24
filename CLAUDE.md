# CLAUDE.md — Instruções para o Claude Code

Este arquivo descreve o projeto para o Claude Code, para que futuras sessões de desenvolvimento tenham contexto imediato sem precisar repassar o histórico.

## O que é este projeto

Extensão Chrome chamada **"Busca Rápida de Leis"** (Meu Vade Mecum), desenvolvida por Alvaro Souza, advogado. É um Vade Mecum digital pessoal que permite acessar artigos de leis diretamente no Planalto.gov.br e consultar um índice remissivo extraído de um Vade Mecum físico de Direito Penal.

## Arquivos principais

- `manifest.json` — configuração da extensão (Manifest V3, permissão `storage`)
- `popup.html` — interface com três abas: Busca Rápida, Índice, Gerenciar
- `popup.js` — toda a lógica: busca por artigo, índice remissivo, gerenciamento de leis, importação JSON

## Estrutura de dados

### Leis (`chrome.storage.local` → chave `leisSalvas`)
```json
[
  { "sigla": "CP", "nome": "Código Penal", "url": "https://...", "limite": 361 }
]
```

### Índice Remissivo (`chrome.storage.local` → chave `indiceRemissivo`)
```json
[
  {
    "termo": "Pena > Restritiva de direitos",
    "etiqueta": "ÍNDICE CF/CP/CPP",
    "lei": "CP",
    "artigos": ["46", "47"]
  }
]
```

## Decisões arquiteturais importantes

- A extensão **não faz requisições externas** — tudo é local via `chrome.storage.local`
- A busca usa o recurso nativo do Chrome `#:~:text=` para posicionar no artigo
- O CP (Decreto-Lei 2.848) usa hífen como separador (`Art. 21 -`); outras leis usam ponto (`Art. 18.`) — isso está tratado na função `dispararLinkArtigo()`
- O campo `limite` nas leis é opcional — se ausente, a trava de artigo inválido não é acionada
- Remissões "Vide" no índice são preservadas como dado bruto (`"artigos": ["Vide Crimes"]`) e resolvidas dinamicamente na interface

## Pipeline de dados (índice remissivo)

O índice remissivo é gerado a partir do Vade Mecum físico em três fases:

1. **OCR (Fase 2)** — prompt documentado em `pipeline/prompt-ocr.md`; a IA transcreve o texto bruto das páginas escaneadas, 2 páginas por vez, aguardando "siga"
2. **Transformação (Fase 3)** — prompt a criar em `pipeline/prompt-json.md`; converte o texto bruto consolidado em JSON no formato acima
3. **Importação** — o JSON é colado no campo "Importar Dados da IA" na aba Gerenciar

## Vade Mecum físico (fonte dos dados)

Conteúdo coberto: CF, CP, CPP, CPM, LINDB, Legislação Complementar, Súmulas (STF vinculantes, STF, STJ, TFR).
Índices remissivos a extrair: CF/CP/CPP (pág. 1370), Legislação Complementar (pág. 1447), Súmulas (pág. 1470) — total ~60+ páginas.

## Perfil do desenvolvedor

Alvaro não é programador — desenvolveu o projeto com auxílio de IAs. Prefere receber **arquivos completos** ao invés de trechos para substituição. Tem bom raciocínio analítico e toma decisões arquiteturais bem fundamentadas.

## Estado atual

- v3.0 funcional e instalada no Chrome
- Índice remissivo ainda sem dados (pendente Fases 2 e 3)
- Repositório GitHub recém-criado para portfólio
