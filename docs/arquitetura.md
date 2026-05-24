# Arquitetura da Extensão

## Visão Geral

A extensão é intencionalmente simples e leve. Tem três arquivos de código e não depende de servidores externos, frameworks ou bibliotecas de terceiros.

## Princípios de design

1. **Zero dependências externas** — tudo roda localmente no navegador
2. **Privacidade por padrão** — nenhum dado sai do computador do usuário
3. **Leveza** — o popup abre instantaneamente; não há delays de rede
4. **Manutenibilidade** — qualquer pessoa com conhecimento básico de JS consegue entender e modificar

## Como a busca por artigo funciona

O Chrome suporta um recurso nativo chamado **Text Fragments** (`#:~:text=`). Ao adicionar esse fragmento ao final de qualquer URL, o navegador abre a página, rola automaticamente até o texto correspondente e o destaca em amarelo.

A extensão monta a URL assim:
```
https://www.planalto.gov.br/...(url da lei)...#:~:text=Art.%2021%20-
```

**Detalhe importante:** leis antigas (ex: CP, de 1940) usam hífen após o número do artigo (`Art. 21 -`), enquanto leis mais recentes usam ponto (`Art. 18.`). Essa diferença é tratada na função `dispararLinkArtigo()` em `popup.js`, que identifica leis antigas pela URL.

## Armazenamento de dados

Todos os dados ficam no `chrome.storage.local` — banco de dados interno do navegador, físicamente no disco local do usuário.

| Chave | Conteúdo |
|-------|----------|
| `leisSalvas` | Array de leis cadastradas (sigla, nome, URL, limite de artigos) |
| `indiceRemissivo` | Array de remissões do índice (termo, lei, artigos) |
| `rascunhoNovo` | Rascunho temporário do formulário de cadastro de lei |

## Por que não usar a API do Senado

A API do Senado resolve um problema diferente: descobrir a URL de uma lei a partir do seu número quando o usuário não a cadastrou previamente. Na nossa arquitetura, o usuário cadastra manualmente a URL compilada, garantindo que sempre apontem para a versão limpa do texto. Integrar a API adicionaria complexidade assíncrona e quebraria o funcionamento offline sem benefício real para o caso de uso.

## Limitação conhecida: Text Fragments

O recurso `#:~:text=` não aceita condicionais — não é possível tentar um padrão e, se falhar, tentar outro. Por isso o mapeamento de sufixo (hífen vs. ponto) é feito no lado do código, por lei. Seria possível criar um Content Script que injeta código na página do Planalto para fazer buscas mais sofisticadas, mas isso exigiria permissões adicionais de leitura de sites e tornaria a extensão mais pesada e invasiva.
