# Roadmap

## Concluído

### v1.0 — Busca básica por artigo
- Menu suspenso com leis fixas no código
- Campo de número de artigo
- Abertura de nova aba com destaque via `#:~:text=`

### v1.1 — Correções e robustez
- Encoding UTF-8 corrigido
- Lógica de sufixo por tipo de lei (hífen vs. ponto)
- Trava de limite de artigos com opção de ir ao último
- Links compilados corrigidos (LGPD, CF)

### v2.0 — Gerenciamento dinâmico de leis
- `chrome.storage.local` substituiu leis fixas no HTML
- Painel de gerenciamento (adicionar, excluir leis)
- Rascunho automático do formulário
- Validação de siglas duplicadas

### v3.0 — Estrutura de Vade Mecum completo
- Interface em três abas (Busca Rápida, Índice, Gerenciar)
- Índice remissivo com busca por palavra e navegação A–Z
- Importação em massa de dados via JSON
- Alerta para leis não cadastradas

---

## Próximos passos

### v3.1 — Documentação e portfólio
- [ ] README.md completo
- [ ] CHANGELOG.md com histórico de versões
- [ ] CLAUDE.md com contexto para futuras sessões
- [ ] Docs de arquitetura e modelo de dados
- [ ] Prompts da pipeline de dados documentados
- [ ] Repositório público no GitHub

### v4.0 — Dados do índice remissivo
- [ ] Extração OCR das ~60 páginas do índice físico (Fase 2 — prompt documentado)
- [ ] Transformação do texto bruto em JSON (Fase 3 — prompt a criar)
- [ ] Importação e validação dos dados na extensão
- [ ] Teste end-to-end: buscar termo → clicar artigo → abrir Planalto no ponto certo

### v4.1 — Tratamento de "Vide"
- [ ] Implementar navegação interna: ao clicar em `"Vide X"`, a busca do índice é acionada automaticamente com o termo X

### Ideias para versões futuras
- Filtros por etiqueta no índice (ex: mostrar apenas súmulas, apenas CF/CP/CPP)
- Exportar/importar backup completo do acervo (leis + índice) em JSON
- Indicador visual de quantas remissões estão cadastradas
- Suporte a abas com filtro por origem (CF/CP/CPP · Leg. Complementar · Súmulas)
