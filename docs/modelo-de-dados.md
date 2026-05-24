# Modelo de Dados

## Leis (`leisSalvas`)

Cada lei cadastrada na extensão tem a seguinte estrutura:

```json
{
  "sigla": "CP",
  "nome": "Código Penal",
  "url": "https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm",
  "limite": 361
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `sigla` | string | sim | Identificador único. Usado para cruzar com o campo `lei` do índice remissivo |
| `nome` | string | sim | Nome exibido no menu suspenso |
| `url` | string | sim | URL compilada do Planalto.gov.br (sem `#:~:text=`) |
| `limite` | number \| null | não | Número do último artigo. Se ausente, a trava de artigo inválido é desativada |

## Índice Remissivo (`indiceRemissivo`)

Cada entrada do índice tem a seguinte estrutura:

```json
{
  "termo": "Pena > Restritiva de direitos",
  "etiqueta": "ÍNDICE CF/CP/CPP",
  "lei": "CP",
  "artigos": ["46", "47"]
}
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `termo` | string | Palavra-chave com hierarquia achatada usando `>` como separador |
| `etiqueta` | string | Origem do índice (ex: "ÍNDICE CF/CP/CPP", "LEGISLAÇÃO COMPLEMENTAR", "SÚMULAS") |
| `lei` | string | Sigla da lei. Deve corresponder a uma sigla cadastrada em `leisSalvas` |
| `artigos` | string[] | Array de artigos. Pode conter números (`"46"`) ou remissões brutas (`"Vide Crimes"`) |

## Regras de formação do campo `termo`

- Palavra-chave principal em caixa alta: `"AÇÃO PENAL"`
- Subitens separados por ` > `: `"PENA > Restritiva de direitos > Prestação de serviços"`
- A hierarquia reflete os recuos visuais do índice impresso

## Regras de formação do campo `artigos`

- Artigo único: `["121"]`
- Múltiplos artigos: `["10", "15", "42"]`
- Intervalo (ex: "arts. 77 a 82"): apenas o primeiro artigo → `["77"]`
- Remissão indireta: dado bruto → `["Vide Crimes contra o patrimônio"]`

## Comportamento da interface para cada tipo de `artigos`

| Conteúdo | Comportamento na extensão |
|----------|--------------------------|
| Um número | Abre diretamente o artigo no Planalto |
| Múltiplos números | Exibe um botão para cada artigo |
| `"Vide X"` | Exibe botão que aciona a busca por "X" no próprio índice |
