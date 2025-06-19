
let urlDoLink;


fetch('dados.json') 
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao carregar o JSON');
    }
    return response.json();
  })
  .then(data => {

    const linkComId1 = data.links.find(link => link.id === 1);
    
    if (linkComId1) {
      urlDoLink = linkComId1.url;
      console.log('URL do link com id 1:', urlDoLink);
    } else {
      console.log('Link com id 1 não encontrado');
    }
  })
  .catch(error => {
    console.error('Erro:', error);
  });

function compareText() {
    const userText = document.getElementById("userInput").value;
    const resultElement = document.getElementById("result");

    if (userText.trim() === urlDoLink ) {
        alert("O link é igual! Ele provavelmente é seguro!");
    } else {
        alert("O link é diferente! Pode ser um golpe!");
    }
}


