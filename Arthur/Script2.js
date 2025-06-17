let tutorials = JSON.parse(localStorage.getItem('tutorials')) || [];

function saveTutorials() {
  localStorage.setItem('tutorials', JSON.stringify(tutorials));
}

const isAdmin = document.body.id === 'page-admin';
const isUsuario = document.body.id === 'page-usuario';

if (isAdmin) {
  const form = document.getElementById('tutorial-form');
  const titleInput = document.getElementById('title');
  const descInput = document.getElementById('description');
  const linkInput = document.getElementById('link');
  const tutorialList = document.getElementById('tutorial-list');
  let editIndex = null;

  function renderTutorialsAdmin() {
    tutorialList.innerHTML = '';
    tutorials.forEach((tut, idx) => {
      const div = document.createElement('div');
      div.className = 'tutorial-item';

      div.innerHTML = `
        <div class="tutorial-info">
          <strong>${tut.title}</strong><br/>
          <small>${tut.description}</small>
        </div>
        <div class="tutorial-buttons">
          <button type="button" onclick="editTutorial(${idx})">Editar</button>
          <button type="button" onclick="deleteTutorial(${idx})">Excluir</button>
        </div>
      `;
      tutorialList.appendChild(div);
    });
  }

  function clearForm() {
    titleInput.value = '';
    descInput.value = '';
    linkInput.value = '';
    form.classList.remove('edit-mode');
    editIndex = null;
    document.getElementById('submit-btn').textContent = 'Adicionar Tutorial';
  }

  window.editTutorial = function(index) {
    const tut = tutorials[index];
    titleInput.value = tut.title;
    descInput.value = tut.description;
    linkInput.value = tut.link;
    form.classList.add('edit-mode');
    editIndex = index;
    document.getElementById('submit-btn').textContent = 'Salvar Alterações';
  };

  window.deleteTutorial = function(index) {
    if (confirm('Deseja realmente excluir este tutorial?')) {
      tutorials.splice(index, 1);
      saveTutorials();
      renderTutorialsAdmin();
      clearForm();
    }
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const link = linkInput.value.trim();

    if (!title || !description || !link) {
      alert('Preencha todos os campos.');
      return;
    }

    if (editIndex !== null) {
      tutorials[editIndex] = { title, description, link };
    } else {
      tutorials.push({ title, description, link });
    }
    saveTutorials();
    renderTutorialsAdmin();
    clearForm();
  });

  renderTutorialsAdmin();
}

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
    nextBtn.disabled = currentIndex === tutorials.length - 1;
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

  renderCarousel();
}
