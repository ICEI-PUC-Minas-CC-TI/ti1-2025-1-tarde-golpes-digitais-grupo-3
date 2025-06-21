import { buscarArtigos, adicionarArtigo, deletarArtigo } from './crud.js';

const form = document.getElementById('form-artigo');
const lista = document.getElementById('lista-artigos');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = form.titulo.value.trim();
  const conteudo = form.conteudo.value.trim();
  if (!titulo || !conteudo) return;

  await adicionarArtigo({ titulo, conteudo });
  form.reset();
  renderizarArtigosAdmin();
});

async function renderizarArtigosAdmin() {
  const artigos = await buscarArtigos();
  lista.innerHTML = '';

  artigos.forEach(({ id, titulo, conteudo }) => {
    const card = document.createElement('div');
    card.className = 'card';

    const icon = document.createElement('i');
    icon.className = 'fas fa-trash delete-icon';
    icon.addEventListener('click', async () => {
      await deletarArtigo(id);
      renderizarArtigosAdmin();
    });

    card.innerHTML = `
      <h3>${titulo}</h3>
      <p>${conteudo}</p>
    `;

    card.appendChild(icon);
    lista.appendChild(card);
  });
}

renderizarArtigosAdmin();