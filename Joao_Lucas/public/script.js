document.getElementById('form-comentario').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const comentario = document.getElementById('comentario').value;

  fetch('/comentarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, comentario })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById('form-comentario').reset();
      fetchComentarios();
    });
});

function fetchComentarios() {
  fetch('/comentarios')
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById('lista-comentarios');
      lista.innerHTML = '';

      data.sort((a, b) => b.likes - a.likes); // ordena por likes

      data.forEach(c => {
        const div = document.createElement('div');
        const voted = localStorage.getItem('voted-' + c.id);

        div.innerHTML = `
          <strong>${c.nome}</strong><br>
          ${c.comentario}
          <div class="reacoes">
            👍 <span id="like-${c.id}">${c.likes}</span>
            <button ${voted ? 'disabled' : ''} onclick="like('${c.id}')">Curtir</button>
            👎 <span id="dislike-${c.id}">${c.dislikes}</span>
            <button ${voted ? 'disabled' : ''} onclick="dislike('${c.id}')">Descurtir</button>
          </div>
          <hr>
        `;
        lista.appendChild(div);
      });
    })
    .catch(err => console.error('Erro ao carregar comentários:', err));
}

function like(id) {
  if (localStorage.getItem('voted-' + id)) return;

  fetch(`/comentarios/${id}/like`, { method: 'POST' })
    .then(() => {
      localStorage.setItem('voted-' + id, 'like');
      fetchComentarios();
    });
}

function dislike(id) {
  if (localStorage.getItem('voted-' + id)) return;

  fetch(`/comentarios/${id}/dislike`, { method: 'POST' })
    .then(() => {
      localStorage.setItem('voted-' + id, 'dislike');
      fetchComentarios();
    });
}

// Carrega os comentários ao abrir a página
fetchComentarios();