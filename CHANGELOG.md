# Changelog

Todas as mudanças relevantes deste projeto estão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/) e o versionamento segue [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [4.0.0] — 2026-05-24

### Adicionado
- **Índice remissivo com dados reais**: 6.451 entradas cobrindo CP, CPP, CF, CPM, CTB, LEP, Súmulas STF/STJ e OAB
- **CPP** adicionado às leis padrão (`defaultLeis`) com URL e limite corretos
- **Página admin** (`admin/carregar-indice.html`) para importação do JSON via interface gráfica
- **Auto-merge de leis padrão**: ao iniciar, a extensão adiciona automaticamente ao storage qualquer lei padrão ainda não cadastrada

### Corrigido
- Script de transformação OCR (`scripts/transform-ocr-to-json.py`) preserva sufixos de letra nos artigos (ex: `168-A`, `28-A`, `337-B`) — antes eram truncados para apenas o número
- Navegação do índice remissivo: ao clicar em uma remissão, abre a lei **e posiciona diretamente no artigo** via `#:~:text=`
- Lógica de formatação de artigo tornada resiliente: tenta o formato traço (`Art. 22 -`, usado pelo CP) **e** o formato ponto (`Art. 22.`, usado pelas demais leis) — o Chrome usa o primeiro que encontrar na página
- Script inline na página admin movido para arquivo externo (`admin/carregar-indice.js`) para conformidade com CSP do Manifest V3

---

## [3.0.0] — 2026-05-24

### Adicionado
- Interface reorganizada em três abas: **Busca Rápida**, **Índice** e **Gerenciar**
- Aba **Índice Remissivo** com barra de busca por palavra-chave e botões de navegação A–Z
- Campo de **importação em massa** de dados via JSON (para popular o índice via IA)
- **Alerta inteligente** quando o artigo consultado pertence a uma lei não cadastrada
- Motor central `dispararLinkArtigo()` reutilizado por ambas as abas

### Alterado
- Estrutura do `popup.js` refatorada para suportar múltiplas telas

---

## [2.0.0] — 2026-05

### Adicionado
- Armazenamento das leis via `chrome.storage.local` (banco de dados interno do navegador)
- Painel **Gerenciar Leis** com formulário para adicionar novas leis (sigla, nome, URL, limite)
- Exclusão de leis com confirmação
- **Rascunho automático** do formulário: se o popup fechar sem querer, os dados digitados são preservados
- Validação de siglas duplicadas
- Mensagem de confirmação ao adicionar ou excluir uma lei

### Alterado
- Leis deixaram de estar fixas no HTML e passaram a ser carregadas dinamicamente do storage
- Layout expandido para 280px para acomodar os novos controles

---

## [1.1.0] — 2026-05

### Corrigido
- Encoding UTF-8 adicionado ao HTML (corrige acentuação nos nomes das leis)
- Lógica de busca ajustada para leis antigas (ex: CP usa hífen — `Art. 21 -`) vs. leis novas (usam ponto — `Art. 18.`)
- Link da LGPD e da CF atualizados para versões compiladas do Planalto

### Adicionado
- Trava de limite de artigos por lei
- Ao ultrapassar o limite, pergunta se deseja ir ao último artigo
- Campo de limite de artigos tornado opcional no cadastro

---

## [1.0.0] — 2026-05

### Adicionado
- Versão inicial da extensão com três arquivos: `manifest.json`, `popup.html`, `popup.js`
- Menu suspenso com leis fixas (CP, CPC, CC, CDC, LGPD, CF)
- Campo de número de artigo com suporte à tecla Enter
- Abertura de nova aba com destaque via fragmento de texto (`#:~:text=`)
