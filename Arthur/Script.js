function initSite() {
  // Definir evento para todos botões da navegação
  const buttons = document.querySelectorAll('.nav-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active de todos os botões
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Esconde todas as abas
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));

      // Mostra a aba clicada
      const id = btn.getAttribute('data-target');
      document.getElementById(id).classList.remove('hidden');
    });
  });

  // Inicializa com a aba notícias aberta
  buttons[0].click();

  // Carrega os dados do JSON para as abas
  carregarDados();
}
