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

- [ ] Implementar: ao clicar em "Vide X", a busca do índice é acionada automaticamente com o termo X
- [ ] Testar com casos reais do índice importado
- [ ] Commit v4.1 + atualizar CHANGELOG.md

---

## v4.2 — Índice remissivo Súmulas

- [ ] Extração OCR das páginas de súmulas
- [ ] Transformação em JSON
- [ ] Importar e testar
- [ ] Commit v4.2 + atualizar CHANGELOG.md

---

## v4.3 — Índice remissivo Legislação Complementar

- [ ] Extração OCR (volume maior — planejamento específico necessário)
- [ ] Transformação em JSON
- [ ] Mecanismo de descoberta de URLs para leis não cadastradas
- [ ] Importar e testar
- [ ] Commit v4.3 + atualizar CHANGELOG.md

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
