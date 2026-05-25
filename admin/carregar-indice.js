const input  = document.getElementById('arquivo');
const btn    = document.getElementById('btn');
const status = document.getElementById('status');

input.addEventListener('change', () => {
  btn.disabled = !input.files.length;
  status.textContent = '';
});

btn.addEventListener('click', () => {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const dados = JSON.parse(e.target.result);
      if (!Array.isArray(dados)) throw new Error('O arquivo não é uma lista JSON.');

      chrome.storage.local.set({ indiceRemissivo: dados }, () => {
        if (chrome.runtime.lastError) {
          mostrar('Erro ao salvar: ' + chrome.runtime.lastError.message, 'err');
        } else {
          mostrar(`Sucesso! ${dados.length} entradas carregadas no índice remissivo.`, 'ok');
          input.value = '';
          btn.disabled = true;
        }
      });
    } catch (err) {
      mostrar('Erro ao ler o JSON: ' + err.message, 'err');
    }
  };
  reader.readAsText(file, 'utf-8');
});

function mostrar(msg, tipo) {
  status.textContent = msg;
  status.className = tipo;
}
