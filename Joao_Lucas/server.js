const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const COMMENTS_FILE = path.join(__dirname, 'comments.json');

app.use(bodyParser.json());
app.use(express.static('public'));

function lerComentarios() {
  if (!fs.existsSync(COMMENTS_FILE)) return [];
  const data = fs.readFileSync(COMMENTS_FILE, 'utf8');
  return JSON.parse(data || '[]');
}

function salvarComentarios(comentarios) {
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comentarios, null, 2));
}

app.get('/comentarios', (req, res) => {
  res.json(lerComentarios());
});

app.post('/comentarios', (req, res) => {
  const { nome, comentario } = req.body;
  const novoComentario = {
    id: uuidv4(),
    nome,
    comentario,
    likes: 0,
    dislikes: 0
  };

  const comentarios = lerComentarios();
  comentarios.push(novoComentario);
  salvarComentarios(comentarios);
  res.status(201).json(novoComentario);
});

app.post('/comentarios/:id/like', (req, res) => {
  const comentarios = lerComentarios();
  const comentario = comentarios.find(c => c.id === req.params.id);
  if (comentario) {
    comentario.likes++;
    salvarComentarios(comentarios);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Comentário não encontrado" });
  }
});

app.post('/comentarios/:id/dislike', (req, res) => {
  const comentarios = lerComentarios();
  const comentario = comentarios.find(c => c.id === req.params.id);
  if (comentario) {
    comentario.dislikes++;
    salvarComentarios(comentarios);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Comentário não encontrado" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
