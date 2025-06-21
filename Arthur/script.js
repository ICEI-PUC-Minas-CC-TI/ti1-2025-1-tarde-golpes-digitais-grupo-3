import { buscarArtigos } from './crud.js';

async function renderizarArtigosPublico() 
{
  const artigos = await buscarArtigos();
  const container = document.getElementById('lista-artigos');
  container.innerHTML = '';

  artigos.forEach
  (
    ({ titulo, conteudo }) => 
      {
       const card = document.createElement('div');
       card.className = 'card';
       card.innerHTML = `
       <h3>${titulo}</h3>
       <p>${conteudo}</p>
       `;
       container.appendChild(card);
      }
  );
}

renderizarArtigosPublico();
