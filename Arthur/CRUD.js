const STORAGE_KEY = "dismascara-dados";

function salvarDados(dados) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

function carregarDados() {
  const dados = localStorage.getItem(STORAGE_KEY);
  if (dados) {
    return JSON.parse(dados);
  } else {
    // Inicializa com listas vazias para as três abas
    return { noticias: [], artigos: [], informacoes: [] };
  }
}

// Função para adicionar item
function adicionarItem(aba, titulo, conteudo) {
  const dados = carregarDados();
  const lista = dados[aba];
  const novoId = lista.length > 0 ? Math.max(...lista.map(i => i.id)) + 1 : 1;
  lista.push({ id: novoId, titulo, conteudo });
  salvarDados(dados);
  return dados;
}

// Função para atualizar item
function atualizarItem(aba, id, titulo, conteudo) {
  const dados = carregarDados();
  const item = dados[aba].find(i => i.id === id);
  if (item) {
    item.titulo = titulo;
    item.conteudo = conteudo;
    salvarDados(dados);
  }
  return dados;
}

// Função para excluir item
function excluirItem(aba, id) {
  const dados = carregarDados();
  dados[aba] = dados[aba].filter(i => i.id !== id);
  salvarDados(dados);
  return dados;
}