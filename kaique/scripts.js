const videos = [
  {
    titulo:
      "HACKERS CONTAM COMO ENGANAM VÍTIMAS DO GOLPE DO PIX; SAIBA COMO SE PROTEGER",
    url: "https://www.youtube.com/embed/JEP9pmN2GEM?si=sfGveVhk65rev92x",
  },
  {
    titulo: "GOLPES DIGITAIS: INVASÃO DE REDES SOCIAIS É CADA VEZ MAIS COMUM",
    url: "https://www.youtube.com/embed/G-3jkrjjP7Q?si=USsjIZwpfmO5WcT7",
  },
  {
    titulo: "FRAUDES DIGITAIS CRESCERAM 45% EM 2024",
    url: "https://www.youtube.com/embed/NkI6j5FeCLY?si=OYxmkRXuSprpwRGM",
  },
  {
    titulo:
      "GOLPES VIRTUAIS ATINGEM UM QUARTO DA POPULAÇÃO BRASILEIRA, REVELA PESQUISA",
    url: "https://www.youtube.com/embed/ab6Aw6UDPQY?si=WVEK0HrOz6pnP7Rv",
  },
  {
    titulo:
      "JR Dinheiro: Número de golpes digitais aumenta no Brasil; jovens e idosos são as principais vítimas",
    url: "https://www.youtube.com/embed/8uZN5U06s6o?si=hd9O2dNKNDpKotbi",
  },
];

const container = document.getElementById("video-container");

videos.forEach((video) => {
  const div = document.createElement("div");
  div.classList.add("video");

  div.innerHTML = `
    <h4>${video.titulo}</h4>
    <iframe width="560" height="315" src="${video.url}" frameborder="0" allowfullscreen></iframe>
  `;

  container.appendChild(div);
});
