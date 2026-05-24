# Ideias & Backlog

Este arquivo é o repositório de ideias do projeto — tudo que vale registrar mas não vale fazer agora.
Regra: nenhuma ideia daqui entra no código sem primeiro passar pelo roadmap.md.

---

## Visão do produto (versão final ideal)

O sistema é um Vade Mecum digital evergreen — sempre atualizado — distribuído como extensão de browser.

### Módulo 1 — Mecanismo de Busca por Artigo
MVP já existe (v3.0). Usuário seleciona a lei, informa o artigo, o app abre o site governamental no artigo exato.

### Módulo 2 — Vade Mecum completo
**2.1 Índice Remissivo**
- Busca por palavra-chave jurídica
- Navegação A–Z (experiência de "folhear" o índice físico)
- Filtros por etiqueta: CF/CP/CPP · Legislação Complementar · Súmulas
- Tratamento de remissões "Vide" como navegação interna
- Lista de abreviaturas consultável

**2.2 Outras funcionalidades (levantadas anteriormente)**
- Sumário navegável (lista de leis com ordenação alfabética ou cronológica)
- Índice cronológico geral
- Alerta inteligente para leis não cadastradas
- Rascunho automático no formulário de cadastro

**2.3 Esqueleto de Peças Processuais** *(ideia nova — alto valor, alta complexidade)*
- Templates de peças processuais (ex: RESE, Habeas Corpus, Recurso de Apelação)
- Cada elemento da peça acompanhado do artigo de fundamento legal clicável
- Clicar no artigo abre o Planalto diretamente no dispositivo
- Exemplo: RESE → "cabimento: art. 581, CPP" → clique → abre CPP no art. 581
- Possível estrutura: Título, Competência, Fundamento, Pedido — cada campo com âncoras legais

### Módulo 3 — Modelo de negócio (futuro)
- Versão gratuita: índice atualizado anualmente (snapshot)
- Versão paga: índice sempre atualizado (evergreen / push automático)
- Diferentes sabores/edições: Vade Penal, Trabalhista, Cível, Tributário etc.
- Publicação no Chrome Web Store
- Expansão para outros browsers (Firefox, Edge)

---

## Fluxo de expansão planejado (ordem de execução)

1. Índice remissivo CF/CP/CPP → MVP do índice
2. Índice remissivo Súmulas
3. Índice remissivo Legislação Complementar (trabalho maior — muitas leis)
4. Para cada lei do índice complementar sem URL cadastrada: usar mecanismo de busca integrado para encontrar o link oficial e cadastrar
5. Repetir o ciclo para outros sabores: Trabalhista, Cível, Tributário etc.

## Mecanismo de descoberta de leis (feature futura — alta prioridade)

Problema: o índice remissivo vai conter termos que apontam para leis não cadastradas (ex: "violência doméstica" → Lei Maria da Penha). O usuário precisa de um jeito rápido de encontrar o link oficial e cadastrar a lei sem sair do fluxo.

Solução pensada:
- Botão ou atalho na extensão para buscar a lei diretamente em sites governamentais (Planalto, Senado)
- Ao encontrar, o app preenche automaticamente o formulário de cadastro (sigla, nome, URL)
- Usuário confirma e a lei entra na lista

## Release Notes / Changelog do índice (feature futura)

- Registro de atualizações do índice remissivo com data e lista de leis adicionadas/atualizadas
- Exemplo: "Atualizado em 2026-06-01: adicionados links para Lei Maria da Penha, LEP, ECA"
- Útil especialmente na versão paga (evidencia o valor do evergreen)

---

## Features isoladas para versões futuras

*(ideias capturadas durante o desenvolvimento — sem compromisso de data)*

- Exportar/importar backup completo (leis + índice) em JSON
- Indicador visual de quantas remissões estão cadastradas
- Modo escuro
- Atalho de teclado para abrir a extensão

---

## Ideias descartadas ou adiadas conscientemente

- Integração com API do Senado — resolvida de forma mais simples com cadastro manual de URLs compiladas
- Pop-up com texto do artigo inline (picture-in-picture) — dependeria de scraping do Planalto, frágil demais
- Múltiplos níveis de contexto como colunas separadas no JSON — resolvido com achatamento usando `>`
