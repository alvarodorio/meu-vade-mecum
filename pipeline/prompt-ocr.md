# Prompt — Fase 2: Extração OCR (Texto Bruto)

Use este prompt ao enviar as imagens/PDF do índice remissivo para uma IA com visão (ChatGPT, Claude, Gemini).

Envie o arquivo completo de uma vez. A IA processará 2 páginas por vez e aguardará o comando **"siga"** antes de continuar.

---

## Prompt

Atue como um transcritor especialista em OCR jurídico e transcrição fiel de texto bruto.

Vou anexar um único arquivo contendo várias páginas escaneadas de um Vade Mecum jurídico. O arquivo pode conter índice remissivo, sumário, listas, abreviaturas ou outras seções.

Nesta etapa, sua tarefa NÃO é criar JSON, NÃO é interpretar juridicamente o conteúdo, NÃO é corrigir o texto e NÃO é resolver remissões "Vide". Sua única tarefa é transcrever fielmente o texto bruto útil das páginas.

**OBJETIVO:**
Extrair o texto bruto das páginas escaneadas, preservando a organização visual, os recuos, as siglas, os artigos, a pontuação, os sinais gráficos e as remissões exatamente como aparecem no documento.

**MODO DE TRABALHO EM PARTES:**
1. O arquivo inteiro será enviado de uma vez, mas você deve processar apenas 2 páginas por resposta.
2. Comece pelas primeiras páginas úteis do arquivo.
3. Quando eu disser "siga", continue exatamente da página seguinte à última página transcrita.
4. Não volte a transcrever páginas já entregues, salvo se eu pedir expressamente.
5. Não avance além do limite de 2 páginas por resposta, mesmo que consiga ler mais.
6. Se uma página tiver muito texto e a resposta ficar longa demais, transcreva apenas 1 página naquele lote, mas nunca corte no meio de um verbete, artigo, linha ou bloco lógico.
7. Ao final, informe apenas o controle mínimo do lote: páginas processadas e próxima página a transcrever.

**IDENTIFICAÇÃO DAS PÁGINAS:**
Antes da transcrição de cada página, coloque um marcador simples:

`[PÁGINA 1371]`

Se o número da página não estiver legível, use uma referência identificável:

`[PÁGINA SEM NÚMERO LEGÍVEL — começa com "AÇÃO PENAL"]`

**ESCOPO E EXCLUSÕES:**
1. Observe o topo da página para identificar o tipo de conteúdo ("ÍNDICE ALFABÉTICO-REMISSIVO", "SUMÁRIO", "LISTA DE ABREVIATURAS" etc.) — use apenas como contexto.
2. Não transcreva cabeçalhos repetidos, títulos correntes do topo, números de página do rodapé, abas laterais, marcadores de margem, ornamentos ou elementos gráficos.
3. Transcreva apenas o miolo textual útil da página.
4. Se o título da seção fizer parte do conteúdo útil (ex: "LISTA DE ABREVIATURAS" no início real da seção), transcreva-o. Se for apenas cabeçalho repetido, ignore.

**ORDEM DE LEITURA:**
1. Leia cada página coluna por coluna, da esquerda para a direita.
2. Dentro de cada coluna, leia de cima para baixo.
3. Preserve a separação entre verbetes principais e subitens.
4. Quando houver recuos, travessões, hífens ou subitens subordinados, mantenha a hierarquia visual usando indentação, hífen ou espaçamento.
5. Não reorganize alfabeticamente, não agrupe termos e não mude a ordem original da página.

**FIDELIDADE:**
1. Copie o texto exatamente como aparece.
2. Preserve maiúsculas, minúsculas, acentos, siglas, abreviações, pontuação, parênteses, barras, hífens, travessões, parágrafos, incisos e alíneas.
3. Preserve referências como "art.", "arts.", "§", "§§", "inc.", "incs.", "caput", "CF", "CP", "CPP", "CC", "CDC", "CLT", "CTN", "CPC", "CPM" etc.
4. Preserve expressões como "Vide", "V.", "v." exatamente como estiverem.
5. Não transforme intervalos de artigos, não desmembre artigos múltiplos, não complete palavras, não corrija erros do original.

**REMISSÕES "VIDE":**
Transcreva exatamente como aparece. Não tente procurar o verbete de destino nem copiar artigos de outro local. Não resolva remissões nesta etapa.

**ILEGIBILIDADE:**
1. Se algum trecho estiver embaçado, cortado ou impossível de ler com segurança, não invente.
2. No local exato do problema, escreva: `[ILEGÍVEL]`
3. Se possível, acrescente contexto: `[ILEGÍVEL — segunda coluna, após "AÇÃO PENAL"]`
4. Se houver dúvida entre duas leituras: `[DÚVIDA: "opção 1" ou "opção 2"]`

**FORMATO DE SAÍDA:**
Entregue apenas a transcrição do lote atual em texto simples, usando este modelo:

```
[PÁGINA X]

texto transcrito da página...

[PÁGINA Y]

texto transcrito da página...

[CONTROLE]
Páginas processadas neste lote: X a Y.
Última página processada: Y.
Próxima página a transcrever quando eu disser "siga": Z.
```

---

## Instruções de uso

1. Abra um novo chat na IA escolhida
2. Cole o prompt acima
3. Anexe o arquivo PDF ou as imagens
4. Envie — a IA processará as primeiras 2 páginas
5. A cada resposta, copie o texto para o arquivo `indice_bruto.txt`
6. Digite **"siga"** para o próximo lote
7. Repita até o `[CONTROLE]` indicar que todas as páginas foram processadas
