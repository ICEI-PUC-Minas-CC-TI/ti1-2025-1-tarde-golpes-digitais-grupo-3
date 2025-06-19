// Simulando um banco de dados JSON no localStorage
const DB_NAME = 'linksDB';
let editingId = null;

// Inicializa o banco de dados se não existir
function initializeDB() {
    if (!localStorage.getItem(DB_NAME)) {
        const initialData = {
            links: [
                { id: 1, url: 'https://www.bb.com.br' },
                { id: 2, url: 'https://www.gov.br/inep/pt-br' }
            ]
        };
        localStorage.setItem(DB_NAME, JSON.stringify(initialData));
    }
}

// Obtém todos os links
function getLinks() {
    const db = JSON.parse(localStorage.getItem(DB_NAME));
    return db.links;
}

// Salva todos os links
function saveLinks(links) {
    const db = JSON.parse(localStorage.getItem(DB_NAME));
    db.links = links;
    localStorage.setItem(DB_NAME, JSON.stringify(db));
}

// Gera um novo ID
function generateId() {
    const links = getLinks();
    if (links.length === 0) return 1;
    return Math.max(...links.map(link => link.id)) + 1;
}

// Adiciona um novo link
function addLink(url) {
    const links = getLinks();
    const newLink = {
        id: generateId(),
        url: url
    };
    links.push(newLink);
    saveLinks(links);
    renderLinks();
}

// Atualiza um link existente
function updateLink(id, newUrl) {
    const links = getLinks();
    const index = links.findIndex(link => link.id === id);
    if (index !== -1) {
        links[index].url = newUrl;
        saveLinks(links);
        renderLinks();
    }
}

// Remove um link
function deleteLink(id) {
    const links = getLinks().filter(link => link.id !== id);
    saveLinks(links);
    renderLinks();
}

// Renderiza a lista de links na tabela
function renderLinks() {
    const links = getLinks();
    const tbody = document.getElementById('links-list');
    tbody.innerHTML = '';

    if (links.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="3" style="text-align: center;">Nenhum link cadastrado</td>`;
        tbody.appendChild(row);
        return;
    }

    links.forEach(link => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${link.id}</td>
            <td><a href="${link.url}" target="_blank">${link.url}</a></td>
            <td class="actions">
                <button class="edit-btn" data-id="${link.id}">Editar</button>
                <button class="delete-btn" data-id="${link.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Adiciona eventos aos botões de edição e exclusão
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editLink(parseInt(btn.dataset.id)));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja excluir este link?')) {
                deleteLink(parseInt(btn.dataset.id));
            }
        });
    });
}

// Prepara o formulário para edição
function editLink(id) {
    const links = getLinks();
    const link = links.find(link => link.id === id);
    if (link) {
        editingId = id;
        document.getElementById('url').value = link.url;
        document.getElementById('form-title').textContent = 'Editar Link';
        document.getElementById('save-btn').textContent = 'Atualizar';
        document.getElementById('cancel-btn').style.display = 'inline-block';
    }
}

// Cancela a edição
function cancelEdit() {
    editingId = null;
    document.getElementById('url').value = '';
    document.getElementById('form-title').textContent = 'Adicionar Novo Link';
    document.getElementById('save-btn').textContent = 'Salvar';
    document.getElementById('cancel-btn').style.display = 'none';
}

// ... (código anterior permanece o mesmo)

// Função para verificar se uma URL existe no banco de dados
function checkUrlExists(urlToCheck) {
    const links = getLinks();
    return links.some(link => {
        // Comparação flexível para considerar variações de URLs
        const normalizedInput = normalizeUrl(urlToCheck);
        const normalizedDbUrl = normalizeUrl(link.url);
        return normalizedInput === normalizedDbUrl;
    });
}

// Função para normalizar URLs para comparação
function normalizeUrl(url) {
    return url.toLowerCase()
        .replace(/^https?:\/\//, '')  // Remove http:// ou https://
        .replace(/^www\./, '')        // Remove www.
        .replace(/\/$/, '');          // Remove barra no final
}

// Função para verificar URL digitada pelo usuário
function checkUserInput() {
    const userInput = document.getElementById('check-url-input').value.trim();
    const resultDiv = document.getElementById('check-result');
    
    if (!userInput) {
        resultDiv.textContent = 'Por favor, digite uma URL para verificar';
        resultDiv.className = 'error';
        return;
    }

    if (checkUrlExists(userInput)) {
        alert("✓ URL encontrada no banco de dados! O link é igual! Ele provavelmente é seguro!");
    } else {
        alert("✗ URL não encontrada no banco de dados! Pode ser um golpe!");
    }
}

// Modificação na função init() para adicionar o novo recurso
function init() {
    initializeDB();
    renderLinks();

    // Evento do botão Salvar/Atualizar
    document.getElementById('save-btn').addEventListener('click', () => {
        const urlInput = document.getElementById('url');
        const url = urlInput.value.trim();

        if (!url) {
            alert('Por favor, digite uma URL válida');
            return;
        }

        if (editingId) {
            updateLink(editingId, url);
        } else {
            addLink(url);
        }

        urlInput.value = '';
        cancelEdit();
    });

    // Evento do botão Cancelar
    document.getElementById('cancel-btn').addEventListener('click', cancelEdit);

    // Evento do botão Verificar URL
    document.getElementById('check-btn').addEventListener('click', checkUserInput);
}

// ... (restante do código permanece o mesmo)

// Inicia o aplicativo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);