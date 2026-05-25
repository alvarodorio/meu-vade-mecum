# Plano de Execução

Status possíveis: `[ ]` pendente · `[→]` em andamento · `[x]` concluído

---

## v3.1 — Documentação e portfólio

- [x] README.md completo
- [x] CHANGELOG.md com histórico desde v1.0
- [x] CLAUDE.md com contexto para futuras sessões
- [x] docs/arquitetura.md
- [x] docs/modelo-de-dados.md
- [x] docs/roadmap.md
- [x] docs/ideias-e-backlog.md
- [x] pipeline/prompt-ocr.md
- [x] Repositório público no GitHub (alvarodorio/meu-vade-mecum)
- [x] Licença MIT

---

## v4.0 — Índice remissivo com dados reais (CF/CP/CPP)

- [x] Texto bruto parcialmente extraído (data/indice-remissivo-bruto.txt)
- [x] **Passo 1:** Avaliar cobertura — páginas 1371–1446 completas (A–Z, sem lacunas)
- [x] **Passo 2:** OCR concluído (não foi necessário completar)
- [x] **Passo 3:** Script de transformação criado (`scripts/transform-ocr-to-json.py`)
- [x] **Passo 4:** JSON gerado — 6.451 entradas (CP, CPP, CF, CPM, CTB, LEP, Súmulas)
- [x] **Passo 5:** JSON importado via `admin/carregar-indice.html`; navegação testada end-to-end
- [x] **Passo 6:** Commit v4.0 + CHANGELOG.md atualizado

---

## v4.1 — Tratamento de "Vide" como navegação interna

- [x] Implementar: ao clicar em "Vide X", a busca do índice é acionada automaticamente com o termo X
- [x] Suporte a "Vide também X" — extrai o termo correto (ignora o "também")
- [x] UX: campo de busca destacado em amarelo por 1s para sinalizar a navegação; scroll vai ao topo dos resultados
- [x] Vide usa busca por `startsWith` — "Vide Réu" mostra RÉU e RÉU > sub-termos (não tudo que contém "réu")
- [x] Busca manual com suporte a frase exata entre aspas (`"acordo de"`) e busca AND sem aspas
- [x] Botão "Buscar" ao lado do campo + Enter aciona a busca; `scrollIntoView` direciona para os resultados
- [x] Entradas OAB removidas do índice principal → salvas em `data/indice-remissivo-oab.json` (para v4.4)
- [x] JSON regenerado: 6.326 entradas (sem OAB)
- [ ] Tratar "Vide [nome de lei]" (ex: "Vide ESTATUTO DO DESARMAMENTO", "Vide estatuto da criança e do adolescente") — hoje faz busca sem resultado; ideal: exibir aviso em vez de busca vazia
- [ ] **284 entradas sem lei**: corrigir no script de transformação o reconhecimento de leis escritas por extenso (ex: "do Código Penal" em vez de "do CP")
- [ ] **ANPP duplicado**: remover entrada `lei=""` duplicada do `indice-remissivo.json` (manter apenas a `lei="CPP"`)
- [ ] Reimportar JSON atualizado via `admin/carregar-indice.html`
- [ ] Testar com casos reais do índice importado
- [ ] Commit v4.1 + atualizar CHANGELOG.md

---

## v4.2 — Melhorias na aba Gerenciar

- [ ] Adicionar botão **Editar** em cada lei (permite corrigir sigla, nome, URL ou limite sem precisar apagar e recadastrar)
- [ ] Aviso ao excluir lei que tem entradas no índice remissivo (mostra contagem de remissões afetadas)
- [ ] Commit v4.2 + atualizar CHANGELOG.md

---

## v4.3 — Índice remissivo Súmulas

- [ ] Verificar se as súmulas já cobertas no JSON atual (STF/STJ do índice CF/CP/CPP) são suficientes ou se há índice de súmulas separado a extrair
- [ ] Extração OCR das páginas de súmulas (se necessário)
- [ ] Transformação em JSON
- [ ] Importar e testar
- [ ] Commit v4.3 + atualizar CHANGELOG.md

---

## v4.4 — Índice remissivo Legislação Complementar

- [ ] Extração OCR (volume maior — planejamento específico necessário)
- [ ] Transformação em JSON
- [ ] **Antes de mapear cada lei nova:** verificar no Planalto o formato de artigo (`Art. 22.` ou `Art. 22 -`) e confirmar que `#:~:text=` funciona
- [ ] Mecanismo de descoberta de URLs para leis não cadastradas
- [ ] Importar e testar
- [ ] Commit v4.4 + atualizar CHANGELOG.md

---

## v5.0 — Mecanismo de descoberta de leis

- [ ] Design da feature (como integrar busca de URL oficial no fluxo da extensão)
- [ ] Implementação
- [ ] Release Notes do índice (registro de atualizações com data e leis adicionadas)
- [ ] Commit v5.0 + atualizar CHANGELOG.md

---

## Futuro (sem versão definida)

- [ ] Esqueleto de peças processuais com âncoras legais clicáveis
- [ ] Publicação no Chrome Web Store
- [ ] Modelo freemium (gratuito anual / pago evergreen)
- [ ] Expansão para outros browsers
- [ ] Outros sabores: Vade Trabalhista, Cível, Tributário
