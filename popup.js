const defaultLeis = [
  { sigla: "CP",  nome: "Código Penal",                url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm",              limite: 361  },
  { sigla: "CPP", nome: "Código de Processo Penal",    url: "https://www.planalto.gov.br/ccivil_03/decreto-lei/del3689compilado.htm",              limite: 811  },
  { sigla: "CPC", nome: "Código de Processo Civil",    url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13105.htm",             limite: 1072 },
  { sigla: "CC",  nome: "Código Civil",                url: "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm",                 limite: 2046 },
  { sigla: "CDC", nome: "Cód. Defesa do Consumidor",   url: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm",                      limite: 119  },
  { sigla: "LGPD",nome: "LGPD",                        url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm",    limite: 65   },
  { sigla: "CF",  nome: "Constituição Federal",        url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm",        limite: 250  },
  { sigla: "ECA", nome: "Estatuto da Criança e do Adolescente", url: "https://www.planalto.gov.br/ccivil_03/leis/l8069.htm",                      limite: 267  },
  { sigla: "ED",  nome: "Estatuto do Desarmamento",    url: "https://www.planalto.gov.br/ccivil_03/leis/2003/l10826.htm",                         limite: 37   }
];

// Mapeamento de texto "Vide" que aponta para nome de lei → sigla cadastrada
const VIDE_LEI_MAP = {
  'estatuto da criança e do adolescente': 'ECA',
  'estatuto da crianca e do adolescente': 'ECA',
  'estatuto do desarmamento':             'ED',
};

let minhasLeis = [];
let indiceRemissivo = [];

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['leisSalvas', 'rascunhoNovo', 'indiceRemissivo'], (result) => {
    minhasLeis = (result.leisSalvas && result.leisSalvas.length > 0) ? result.leisSalvas : defaultLeis;
    if (minhasLeis === defaultLeis) {
      salvarNoStorage();
    } else {
      // Adiciona ao storage qualquer lei padrão ainda não cadastrada
      let changed = false;
      defaultLeis.forEach(def => {
        if (!minhasLeis.some(l => l.sigla.toUpperCase() === def.sigla.toUpperCase())) {
          minhasLeis.push(def);
          changed = true;
        }
      });
      if (changed) salvarNoStorage();
    }
    
    indiceRemissivo = result.indiceRemissivo || [];

    atualizarSelectBusca();
    atualizarListaGerenciamento();
    montarBotoesAZ();

    if (result.rascunhoNovo) {
      document.getElementById('nova-sigla').value = result.rascunhoNovo.sigla || '';
      document.getElementById('novo-nome').value = result.rascunhoNovo.nome || '';
      document.getElementById('nova-url').value = result.rascunhoNovo.url || '';
      document.getElementById('novo-limite').value = result.rascunhoNovo.limite || '';
    }
  });
});

function salvarNoStorage() {
  chrome.storage.local.set({ leisSalvas: minhasLeis });
}

// --- NAVEGAÇÃO DE ABAS ---
document.querySelectorAll('.aba-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.aba-btn').forEach(b => b.classList.remove('ativa'));
    e.target.classList.add('ativa');
    document.querySelectorAll('.tela').forEach(t => t.classList.add('hidden'));
    document.getElementById(e.target.dataset.alvo).classList.remove('hidden');
  });
});

// --- RASCUNHO AUTOMÁTICO ---
const formCampos = ['nova-sigla', 'novo-nome', 'nova-url', 'novo-limite'];
formCampos.forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    chrome.storage.local.set({ rascunhoNovo: {
      sigla: document.getElementById('nova-sigla').value,
      nome: document.getElementById('novo-nome').value,
      url: document.getElementById('nova-url').value,
      limite: document.getElementById('novo-limite').value
    }});
  });
});

// --- MOTOR CENTRAL DE ABERTURA DE LINKS ---
function dispararLinkArtigo(sigla, artigoStr, urlForcada = null) {
  const lei = urlForcada ? { url: urlForcada } : minhasLeis.find(l => l.sigla.toUpperCase() === sigla.toUpperCase());
  
  if (!lei) {
    alert(`A norma "${sigla}" não está cadastrada. Adicione-a no menu Gerenciar Leis para acessar este artigo.`);
    return;
  }

  let buscaStr = artigoStr.toString().trim();
  // "337-A a 337-D" → navega para o primeiro artigo da faixa
  const faixa = buscaStr.match(/^(\d+(?:-[A-Z])?)\s+a\s+/i);
  if (faixa) buscaStr = faixa[1];
  let num = parseInt(buscaStr);

  if (num > 0 && num <= 9 && !buscaStr.includes('º')) buscaStr += 'º';

  let urlFinal;
  const temSufixo = buscaStr.includes('-') || buscaStr.includes('º');
  if (temSufixo) {
    // Artigo com letra (28-A) ou ordinal (5º): sem pontuação final, match de prefixo
    urlFinal = `${lei.url}#:~:text=${encodeURIComponent('Art. ' + buscaStr)}`;
  } else {
    // Tenta traço (CP) e ponto (demais leis) — Chrome usa o primeiro que encontrar
    const t1 = encodeURIComponent(`Art. ${buscaStr} -`);
    const t2 = encodeURIComponent(`Art. ${buscaStr}.`);
    urlFinal = `${lei.url}#:~:text=${t1}&text=${t2}`;
  }
  chrome.tabs.create({ url: urlFinal });
}

// --- TELA 1: BUSCA RÁPIDA ---
function atualizarSelectBusca() {
  const select = document.getElementById('lei');
  select.innerHTML = '';
  minhasLeis.forEach((lei, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${lei.sigla} - ${lei.nome}`;
    select.appendChild(option);
  });
}

document.getElementById('buscar').addEventListener('click', () => {
  const lei = minhasLeis[document.getElementById('lei').value];
  const art = document.getElementById('artigo').value;
  if (!art) return;

  if (lei.limite && parseInt(art) > lei.limite) {
    if (confirm(`Esta lei termina no art. ${lei.limite}. Deseja acessar o último artigo?`)) {
      dispararLinkArtigo(lei.sigla, lei.limite.toString(), lei.url);
    }
  } else {
    dispararLinkArtigo(lei.sigla, art, lei.url);
  }
});

document.getElementById('artigo').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('buscar').click();
});

// --- TELA 2: ÍNDICE REMISSIVO ---
function montarBotoesAZ() {
  const container = document.getElementById('letras-az');
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letra => {
    const btn = document.createElement('button');
    btn.className = 'letra-btn';
    btn.textContent = letra;
    btn.onclick = () => {
      const filtrado = indiceRemissivo.filter(item => item.termo.toUpperCase().startsWith(letra));
      renderizarResultadosIndice(filtrado);
    };
    container.appendChild(btn);
  });
}

function filtrarPorTermo(raw) {
  const trimmed = raw.trim();
  // Busca com aspas: "frase exata" → substring exato
  if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length > 2) {
    const frase = trimmed.slice(1, -1).toLowerCase();
    return indiceRemissivo.filter(item => item.termo.toLowerCase().includes(frase));
  }
  // Sem aspas: todas as palavras devem estar presentes (AND)
  const palavras = trimmed.toLowerCase().split(/\s+/).filter(p => p.length > 0);
  return indiceRemissivo.filter(item => {
    const t = item.termo.toLowerCase();
    return palavras.every(p => t.includes(p));
  });
}

function buscarNoIndice(termo) {
  // Muda para a aba Índice
  document.querySelectorAll('.aba-btn').forEach(b => b.classList.remove('ativa'));
  document.querySelector('.aba-btn[data-alvo="tela-indice"]').classList.add('ativa');
  document.querySelectorAll('.tela').forEach(t => t.classList.add('hidden'));
  document.getElementById('tela-indice').classList.remove('hidden');

  // Preenche o campo com destaque visual para sinalizar a navegação
  const campo = document.getElementById('busca-termo');
  campo.value = termo;
  campo.style.background = '#fef9c3';
  setTimeout(() => { campo.style.background = ''; }, 1000);

  // startsWith: "Vide Réu" mostra apenas RÉU e RÉU > sub-termos, não tudo que contém "réu"
  const filtrado = indiceRemissivo.filter(item => item.termo.toLowerCase().startsWith(termo.toLowerCase()));
  renderizarResultadosIndice(filtrado);

  document.getElementById('resultados-indice').scrollTop = 0;
}

document.getElementById('busca-termo').addEventListener('input', (e) => {
  const raw = e.target.value;
  if (raw.trim().length < 2) {
    document.getElementById('resultados-indice').innerHTML = '';
    return;
  }
  renderizarResultadosIndice(filtrarPorTermo(raw));
});

document.getElementById('btn-buscar-indice').addEventListener('click', () => {
  const raw = document.getElementById('busca-termo').value;
  if (raw.trim().length < 2) return;
  renderizarResultadosIndice(filtrarPorTermo(raw));
  document.getElementById('resultados-indice').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('busca-termo').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') document.getElementById('btn-buscar-indice').click();
});

function renderizarResultadosIndice(lista) {
  const container = document.getElementById('resultados-indice');
  container.innerHTML = lista.length ? '' : '<div style="text-align:center; color:#777; margin-top:10px;">Nenhum resultado.</div>';
  
  lista.forEach(item => {
    const div = document.createElement('div');
    div.className = 'resultado-item';
    div.innerHTML = `<div><strong>${item.termo}</strong> <span style="color:#666; font-size:11px;">(${item.etiqueta})</span></div>`;
    
    const divArts = document.createElement('div');
    divArts.style.marginTop = '6px';
    
    item.artigos.forEach(art => {
      const btn = document.createElement('button');
      const vide = typeof art === 'string' && art.match(/^Vide\s+(?:tamb[eé]m\s+)?(.+)$/i);
      if (vide) {
        btn.className = 'btn-artigo btn-vide';
        btn.textContent = art;
        btn.onclick = () => {
          const alvo = vide[1].trim();
          const sigla = VIDE_LEI_MAP[alvo.toLowerCase()];
          if (sigla) {
            const lei = minhasLeis.find(l => l.sigla.toUpperCase() === sigla.toUpperCase());
            if (lei) { chrome.tabs.create({ url: lei.url }); return; }
          }
          buscarNoIndice(alvo);
        };
      } else {
        btn.className = 'btn-artigo';
        btn.textContent = `${item.lei} ${art}`;
        btn.onclick = () => dispararLinkArtigo(item.lei, art);
      }
      divArts.appendChild(btn);
    });
    
    div.appendChild(divArts);
    container.appendChild(div);
  });
}

// --- TELA 3: GERENCIAR E IMPORTAR ---
function atualizarListaGerenciamento() {
  const divLista = document.getElementById('lista-leis');
  divLista.innerHTML = '';
  minhasLeis.forEach((lei, index) => {
    const item = document.createElement('div');
    item.className = 'lei-item';
    item.innerHTML = `<span><strong>${lei.sigla}</strong></span> <button class="btn-danger" data-index="${index}">X</button>`;
    divLista.appendChild(item);
  });

  document.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.getAttribute('data-index');
      if (confirm(`Apagar a lei "${minhasLeis[idx].sigla}"?`)) {
        minhasLeis.splice(idx, 1);
        salvarNoStorage();
        atualizarListaGerenciamento();
        atualizarSelectBusca();
      }
    });
  });
}

document.getElementById('adicionar-lei').addEventListener('click', () => {
  const sigla = document.getElementById('nova-sigla').value.trim();
  const nome = document.getElementById('novo-nome').value.trim();
  const url = document.getElementById('nova-url').value.trim();
  const lim = document.getElementById('novo-limite').value.trim();
  
  if (sigla && nome && url) {
    if (minhasLeis.some(l => l.sigla.toUpperCase() === sigla.toUpperCase())) {
      alert(`A sigla "${sigla}" já está cadastrada.`); return;
    }
    minhasLeis.push({ sigla, nome, url, limite: lim ? parseInt(lim) : null });
    salvarNoStorage();
    atualizarListaGerenciamento();
    atualizarSelectBusca();
    alert(`Lei "${sigla}" adicionada com sucesso!`);
    
    formCampos.forEach(id => document.getElementById(id).value = '');
    chrome.storage.local.remove(['rascunhoNovo']);
  } else {
    alert('Preencha Sigla, Nome e URL.');
  }
});

document.getElementById('btn-importar').addEventListener('click', () => {
  try {
    const jsonPuro = document.getElementById('json-import').value.trim();
    if (!jsonPuro) return;
    const dados = JSON.parse(jsonPuro);
    
    if (Array.isArray(dados)) {
      // Mescla os dados novos com os já existentes, se houver
      indiceRemissivo = [...indiceRemissivo, ...dados]; 
      chrome.storage.local.set({ indiceRemissivo });
      alert(`Sucesso! ${dados.length} remissões importadas e prontas para busca.`);
      document.getElementById('json-import').value = '';
    } else {
      alert('Formato inválido. O JSON deve ser uma lista.');
    }
  } catch (erro) {
    alert('Erro ao ler o JSON. Verifique a formatação do texto copiado.');
  }
});