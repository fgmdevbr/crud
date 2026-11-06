const STORAGE_KEY = 'crud_itens';

let itens = carregar();

const form = document.getElementById('form');
const itemId = document.getElementById('itemId');
const nome = document.getElementById('nome');
const email = document.getElementById('email');
const descricao = document.getElementById('descricao');
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

function renderizar(filtro = '') {
  const termo = filtro.trim().toLowerCase();
  const lista = termo
    ? itens.filter(i =>
        i.nome.toLowerCase().includes(termo) ||
        i.email.toLowerCase().includes(termo) ||
        (i.descricao || '').toLowerCase().includes(termo))
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

    const tdEmail = document.createElement('td');
    tdEmail.textContent = item.email;

    const tdDesc = document.createElement('td');
    tdDesc.textContent = item.descricao || '-';

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
    tr.appendChild(tdEmail);
    tr.appendChild(tdDesc);
    tr.appendChild(tdAcoes);

    tbody.appendChild(tr);
  });
}

function editar(id) {
  const item = itens.find(i => i.id === id);
  if (!item) return;
  itemId.value = item.id;
  nome.value = item.nome;
  email.value = item.email;
  descricao.value = item.descricao || '';
  btnSalvar.textContent = 'Salvar alterações';
  btnCancelar.classList.remove('hidden');
  nome.focus();
}

function excluir(id) {
  if (!confirm('Excluir este item?')) return;
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
    email: email.value.trim(),
    descricao: descricao.value.trim()
  };

  if (!dados.nome || !dados.email) return;

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
