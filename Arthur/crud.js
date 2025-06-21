const API_URL = 'http://localhost:3000/artigos';

export async function buscarArtigos() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function adicionarArtigo(artigo) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(artigo)
  });
  return res.json();
}

export async function deletarArtigo(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
}