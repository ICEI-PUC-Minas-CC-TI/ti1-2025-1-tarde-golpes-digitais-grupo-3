const API_URL = 'http://localhost:3000/tutorials';

let tutorials = [];

const isAdmin = document.body.id === 'page-admin';
const isUsuario = document.body.id === 'page-usuario';

async function fetchTutorials() {
  const res = await fetch(API_URL);
  tutorials = await res.json();
  if (isAdmin) renderTutorialsAdmin();
  if (isUsuario) renderCarousel();
}

async function saveTutorial(tutorial) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tutorial),
  });
  return res.json();
}

async function updateTutorial(id, tutorial) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tutorial),
  });
}

async function deleteTutorial(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  await fetchTutorials();
}

// ADMIN
if (isAdmin) {
  const form = document.getElementById('tutorial-form');
  const titleInput = document.getElementById('title');
  const descInput = document.getElementById('description');
  const linkInput = document.getElementById('link');
  const tutorialList = document.getElementById('tutorial-list');
  let editId = null;

  function renderTutorialsAdmin() {
    tutorialList.innerHTML = '';
    tutorials.forEach((tut) => {
      const div = document.createElement('div');
      div.className = 'tutorial-item';

      div.innerHTML = `
        <div class="tutorial-info">
          <strong>${tut.title}</strong><br/>
          <small>${tut.description}</small>
        </div>
        <div class="tutorial-buttons">
          <button type="button" onclick="editTutorial(${tut.id})">Editar</button>
          <button type="button" onclick="handleDelete(${tut.id})">Excluir</button>
        </div>
      `;
      tutorialList.appendChild(div);
    });
  }

  window.editTutorial = function (id) {
    const tut = tutorials.find(t => t.id === id);
    titleInput.value = tut.title;
    descInput.value = tut.description;
    linkInput.value = tut.link;
    form.classList.add('edit-mode');
    editId = id;
    document.getElementById('submit-btn').textContent = 'Salvar Alterações';
  };

  window.handleDelete = async function (id) {
    if (confirm('Deseja realmente excluir este tutorial?')) {
      await deleteTutorial(id);
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const link = linkInput.value.trim();

    if (!title || !description || !link) {
      alert('Preencha todos os campos.');
      return;
    }

    const tutorial = { title, description, link };

    if (editId) {
      await updateTutorial(editId, { ...tutorial, id: editId });
      editId = null;
    } else {
      await saveTutorial(tutorial);
    }

    form.reset();
    form.classList.remove('edit-mode');
    document.getElementById('submit-btn').textContent = 'Adicionar Tutorial';
    await fetchTutorials();
  });

  fetchTutorials();
}

// USUÁRIO
if (isUsuario) {
  const carouselTrack = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentIndex = 0;

  function renderCarousel() {
    carouselTrack.innerHTML = '';
    if (tutorials.length === 0) {
      carouselTrack.innerHTML = '<p style="padding:1rem; color:#F0941F;">Nenhum tutorial disponível.</p>';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    tutorials.forEach(tut => {
      const card = document.createElement('div');
      card.className = 'card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Abrir tutorial: ${tut.title}`);

      card.innerHTML = `
        <h2>${tut.title}</h2>
        <p>${tut.description}</p>
      `;

      card.addEventListener('click', () => {
        window.open(tut.link, '_blank');
      });

      card.addEventListener('keypress', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.open(tut.link, '_blank');
        }
      });

      carouselTrack.appendChild(card);
    });

    updateCarouselPosition();
    updateButtons();
  }

  function updateCarouselPosition() {
    const cardWidth = carouselTrack.querySelector('.card')?.offsetWidth || 320;
    carouselTrack.style.transform = `translateX(-${cardWidth * currentIndex}px)`;
  }

  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= tutorials.length - 1;
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarouselPosition();
      updateButtons();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < tutorials.length - 1) {
      currentIndex++;
      updateCarouselPosition();
      updateButtons();
    }
  });

  window.addEventListener('resize', updateCarouselPosition);
  fetchTutorials();
}
