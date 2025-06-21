const API_URL = 'http://localhost:3000/tutorials';

let tutorials = [];

const isAdmin = document.body.id === 'page-admin';
const isUsuario = document.body.id === 'page-usuario';

let form, titleInput, descInput, linkInput, tutorialList, submitBtn;
let editId = null;
let cancelBtn;

let carouselTrack, prevBtn, nextBtn;
let currentIndex = 0;

function setLoading(isLoading) {
  if (isAdmin) {
    submitBtn.disabled = isLoading;
    if (cancelBtn) cancelBtn.disabled = isLoading;
  }
  if (isUsuario) {
    prevBtn.disabled = isLoading || currentIndex === 0;
    nextBtn.disabled = isLoading || currentIndex >= tutorials.length - 1;
  }
}

async function fetchTutorials() {
  try {
    setLoading(true);
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Erro ao buscar tutoriais');
    tutorials = await res.json();
    if (isAdmin) renderTutorialsAdmin();
    if (isUsuario) renderCarousel();
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
}

async function saveTutorial(tutorial) {
  try {
    setLoading(true);
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tutorial),
    });
    if (!res.ok) throw new Error('Erro ao salvar tutorial');
    return await res.json();
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
}

async function updateTutorial(id, tutorial) {
  try {
    setLoading(true);
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tutorial),
    });
    if (!res.ok) throw new Error('Erro ao atualizar tutorial');
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
}

async function deleteTutorial(id) {
  if (!confirm('Deseja realmente excluir este tutorial?')) return;
  try {
    setLoading(true);
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao excluir tutorial');
    await fetchTutorials();
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
}

if (isAdmin) {
  form = document.getElementById('tutorial-form');
  titleInput = document.getElementById('title');
  descInput = document.getElementById('description');
  linkInput = document.getElementById('link');
  tutorialList = document.getElementById('tutorial-list');
  submitBtn = document.getElementById('submit-btn');

  cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Cancelar';
  cancelBtn.style.marginLeft = '10px';
  cancelBtn.style.display = 'none'; // inicialmente ele está escondido
  form.querySelector('button[type="submit"]').after(cancelBtn);

  cancelBtn.addEventListener('click', () => {
    clearForm();
  });

  function clearForm() {
    editId = null;
    form.reset();
    form.classList.remove('edit-mode');
    submitBtn.textContent = 'Adicionar Tutorial';
    cancelBtn.style.display = 'none';
  }

  function renderTutorialsAdmin() {
    tutorialList.innerHTML = '';
    tutorials.forEach((tut) => {
      const div = document.createElement('div');
      div.className = 'tutorial-item';

      const infoDiv = document.createElement('div');
      infoDiv.className = 'tutorial-info';
      infoDiv.innerHTML = `<strong>${tut.title}</strong><br/><small>${tut.description}</small>`;

      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'tutorial-buttons';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.textContent = 'Editar';
      editBtn.addEventListener('click', () => editTutorial(tut.id));

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.textContent = 'Excluir';
      deleteBtn.addEventListener('click', () => deleteTutorial(tut.id));

      buttonsDiv.appendChild(editBtn);
      buttonsDiv.appendChild(deleteBtn);

      div.appendChild(infoDiv);
      div.appendChild(buttonsDiv);

      tutorialList.appendChild(div);
    });
  }

  function editTutorial(id) {
    const tut = tutorials.find(t => t.id === id);
    if (!tut) return alert('Tutorial não encontrado');
    titleInput.value = tut.title;
    descInput.value = tut.description;
    linkInput.value = tut.link;
    form.classList.add('edit-mode');
    editId = id;
    submitBtn.textContent = 'Salvar Alterações';
    cancelBtn.style.display = 'inline-block';
  }

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
    } else {
      await saveTutorial(tutorial);
    }

    clearForm();
    await fetchTutorials();
  });

  fetchTutorials();
}

if (isUsuario) {
  carouselTrack = document.getElementById('carousel-track');
  prevBtn = document.getElementById('prev-btn');
  nextBtn = document.getElementById('next-btn');

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

    currentIndex = 0;
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
