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

1. **OCR (Fase 2)** — Claude Code lê os JPGs em `Imagens - Vade/indice alf rem cf cp cpp_2/` dois a dois e transcreve para `data/indice-remissivo-bruto.txt` com marcadores `[PÁGINA XXXX]`.
2. **Transformação (Fase 3)** — Script `scripts/transform-ocr-to-json.py` converte o texto bruto em `data/indice-remissivo.json` (~6.400 entradas no formato da extensão).
3. **Carga no storage (admin)** — Página interna da extensão carrega o JSON direto no `chrome.storage.local`.

### Como atualizar o índice remissivo em massa (uso do administrador)

Quando o `indice-remissivo.json` for regenerado (novo OCR ou correções), siga estes passos:

1. Rode o script de transformação:
   ```
   python scripts/transform-ocr-to-json.py
   ```
2. No Chrome, abra a URL da página admin da extensão:
   ```
   chrome-extension://[ID_DA_EXTENSAO]/admin/carregar-indice.html
   ```
   O ID aparece em `chrome://extensions` abaixo do nome da extensão.
3. Clique em **"Escolher arquivo"**, selecione `data/indice-remissivo.json` e clique em **"Carregar no storage"**.
4. A mensagem de sucesso confirma o número de entradas carregadas.

> A página `admin/carregar-indice.html` não aparece na interface da extensão — é de uso exclusivo do administrador.

## Fonte dos dados

Conteúdo coberto: CF, CP, CPP, CPM, LINDB, Legislação Complementar, Súmulas (STF vinculantes, STF, STJ, TFR).
Índices remissivos a extrair: CF/CP/CPP, Legislação Complementar e Súmulas — total ~60+ páginas.

## Perfil do desenvolvedor

Alvaro não é programador — desenvolveu o projeto com auxílio de IAs. Prefere receber **arquivos completos** ao invés de trechos para substituição. Tem bom raciocínio analítico e toma decisões arquiteturais bem fundamentadas.

## Estado atual

- **v4.0 funcional e instalada no Chrome**
- OCR concluído: `data/indice-remissivo-bruto.txt` cobre páginas 1371–1446 (A–Z, sem lacunas)
- Transformação concluída: `data/indice-remissivo.json` com 6.451 entradas (CP, CPP, CF, CTB, CPM, LEP, Súmulas STF/STJ, OAB)
- JSON carregado no storage via `admin/carregar-indice.html`; aba Índice funcional com navegação end-to-end
- Navegação de artigos usa duplo fragmento de texto (`Art. N -` e `Art. N.`) para suportar tanto o CP quanto as demais leis
- Pendente: redesenhar seção "Importar" do popup para remissões personalizadas do usuário
- Pendente: funcionalidade de edição de leis na aba Gerenciar
- Repositório GitHub público: alvarodorio/meu-vade-mecum
