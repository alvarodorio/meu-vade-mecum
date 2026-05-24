# Meu Vade Mecum — Extensão Chrome

Extensão para Google Chrome que permite a advogados e estudantes de direito acessar artigos de leis diretamente no site compilado do Planalto.gov.br, sem precisar do Google ou do Ctrl+F.

## O que ela faz

- **Busca Rápida:** selecione a lei, digite o número do artigo e a extensão abre uma nova aba já posicionada no artigo, com destaque em amarelo
- **Índice Remissivo:** busque por palavra-chave jurídica (ex: "sursis", "flagrante") ou navegue pelas letras A–Z — a extensão mostra os artigos correspondentes como botões clicáveis
- **Gerenciar Leis:** adicione, edite ou remova normas do seu acervo pessoal. Sem limite de leis cadastradas
- **Importação em massa:** cole um bloco JSON gerado por IA para popular o índice remissivo de uma vez

## O que ela não faz

- Não armazena nem transmite dados para servidores externos
- Não acessa seu histórico de navegação
- Não faz requisições a APIs externas
- Não baixa o texto das leis — apenas constrói o link para o Planalto.gov.br

## Como instalar

1. Baixe ou clone este repositório
2. No Chrome, acesse `chrome://extensions/`
3. Ative o **Modo do desenvolvedor** (canto superior direito)
4. Clique em **Carregar sem compactação** e selecione a pasta do projeto
5. Fixe o ícone na barra do Chrome clicando no ícone de quebra-cabeça

## Leis cadastradas por padrão

| Sigla | Nome | Último artigo |
|-------|------|--------------|
| CP | Código Penal | 361 |
| CPC | Código de Processo Civil | 1072 |
| CC | Código Civil | 2046 |
| CDC | Código de Defesa do Consumidor | 119 |
| LGPD | Lei Geral de Proteção de Dados | 65 |
| CF | Constituição Federal | 250 |

Outras leis podem ser adicionadas manualmente pelo painel **Gerenciar**.

## Estrutura do projeto

```
meu-vade-mecum/
├── manifest.json       # Configuração da extensão Chrome
├── popup.html          # Interface do usuário
├── popup.js            # Lógica da extensão
├── docs/               # Documentação técnica
│   ├── arquitetura.md
│   ├── modelo-de-dados.md
│   └── roadmap.md
├── pipeline/           # Prompts de IA para geração dos dados
│   ├── prompt-ocr.md
│   └── prompt-json.md  (a criar)
└── data/               # Dados extraídos do Vade Mecum físico
    ├── sumário.txt
    └── lista-de-abreviaturas.txt
```

## Versões

Consulte o [CHANGELOG.md](CHANGELOG.md) para o histórico completo de versões.

## Contexto

Este projeto é um Vade Mecum digital pessoal desenvolvido por um advogado com o auxílio de IAs (Claude, ChatGPT, Gemini). O objetivo é demonstrar que profissionais do direito podem construir ferramentas úteis para sua própria prática sem necessariamente serem desenvolvedores.

A base de dados do índice remissivo foi extraída manualmente via OCR assistido por IA, seguindo uma pipeline documentada em `pipeline/`.
