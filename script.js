const STORAGE_KEY = 'pacientes';

let itens = carregar();

const form = document.getElementById('form');
const itemId = document.getElementById('itemId');
const nome = document.getElementById('nome');
const cpf = document.getElementById('cpf');
const nascimento = document.getElementById('nascimento');
const telefone = document.getElementById('telefone');
const convenio = document.getElementById('convenio');
const observacoes = document.getElementById('observacoes');
const tbody = document.getElementById('tbody');
const vazio = document.getElementById('vazio');
const busca = document.getElementById('busca');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');

function carregar() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
}

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function formatarData(iso) {
  if (!iso) return '-';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

function renderizar(filtro = '') {
  const termo = filtro.trim().toLowerCase();
  const lista = termo
    ? itens.filter(i =>
        i.nome.toLowerCase().includes(termo) ||
        i.cpf.toLowerCase().includes(termo) ||
        i.telefone.toLowerCase().includes(termo) ||
        (i.convenio || '').toLowerCase().includes(termo) ||
        (i.observacoes || '').toLowerCase().includes(termo))
    : itens;

  tbody.innerHTML = '';

  if (lista.length === 0) {
    vazio.classList.remove('hidden');
  } else {
    vazio.classList.add('hidden');
  }

  lista.forEach(item => {
    const tr = document.createElement('tr');

    const tdNome = document.createElement('td');
    tdNome.textContent = item.nome;

    const tdCpf = document.createElement('td');
    tdCpf.textContent = item.cpf;

    const tdNascimento = document.createElement('td');
    tdNascimento.textContent = formatarData(item.nascimento);

    const tdTelefone = document.createElement('td');
    tdTelefone.textContent = item.telefone;

    const tdConvenio = document.createElement('td');
    tdConvenio.textContent = item.convenio || '-';

    const tdObservacoes = document.createElement('td');
    tdObservacoes.textContent = item.observacoes || '-';

    const tdAcoes = document.createElement('td');
    tdAcoes.className = 'actions-cell';

    const btnEdit = document.createElement('button');
    btnEdit.textContent = 'Editar';
    btnEdit.className = 'edit';
    btnEdit.onclick = () => editar(item.id);

    const btnDel = document.createElement('button');
    btnDel.textContent = 'Excluir';
    btnDel.className = 'delete';
    btnDel.onclick = () => excluir(item.id);

    tdAcoes.appendChild(btnEdit);
    tdAcoes.appendChild(btnDel);

    tr.appendChild(tdNome);
    tr.appendChild(tdCpf);
    tr.appendChild(tdNascimento);
    tr.appendChild(tdTelefone);
    tr.appendChild(tdConvenio);
    tr.appendChild(tdObservacoes);
    tr.appendChild(tdAcoes);

    tbody.appendChild(tr);
  });
}

function editar(id) {
  const item = itens.find(i => i.id === id);
  if (!item) return;
  itemId.value = item.id;
  nome.value = item.nome;
  cpf.value = item.cpf;
  nascimento.value = item.nascimento;
  telefone.value = item.telefone;
  convenio.value = item.convenio || '';
  observacoes.value = item.observacoes || '';
  btnSalvar.textContent = 'Salvar alterações';
  btnCancelar.classList.remove('hidden');
  nome.focus();
}

function excluir(id) {
  if (!confirm('Excluir este paciente?')) return;
  itens = itens.filter(i => i.id !== id);
  salvar();
  renderizar(busca.value);
}

function limparForm() {
  itemId.value = '';
  form.reset();
  btnSalvar.textContent = 'Adicionar';
  btnCancelar.classList.add('hidden');
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const dados = {
    nome: nome.value.trim(),
    cpf: cpf.value.trim(),
    nascimento: nascimento.value,
    telefone: telefone.value.trim(),
    convenio: convenio.value.trim(),
    observacoes: observacoes.value.trim()
  };

  if (!dados.nome || !dados.cpf || !dados.nascimento || !dados.telefone) return;

  if (itemId.value) {
    const item = itens.find(i => i.id === itemId.value);
    if (item) Object.assign(item, dados);
  } else {
    itens.push({ id: gerarId(), ...dados });
  }

  salvar();
  limparForm();
  renderizar(busca.value);
});

btnCancelar.addEventListener('click', limparForm);

busca.addEventListener('input', () => renderizar(busca.value));

renderizar();