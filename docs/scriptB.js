let videoData = {
  videoId: "001",
  likes: 0,
  likedByUser: false
};

const likeButton = document.getElementById("likeButton");
const likeCount = document.getElementById("likeCount");

// Atualiza o contador na interface
function updateLikeDisplay() {
  likeCount.textContent = videoData.likes;
  if (videoData.likedByUser) {
    likeButton.classList.add("liked");
    likeButton.textContent = "💔 Descurtir";
  } else {
    likeButton.classList.remove("liked");
    likeButton.textContent = "👍 Curtir";
  }
}

// Evento de clique
likeButton.addEventListener("click", () => {
  if (videoData.likedByUser) {
    videoData.likes--;
    videoData.likedByUser = false;
  } else {
    videoData.likes++;
    videoData.likedByUser = true;
  }
  updateLikeDisplay();
});

// Inicializa a interface
updateLikeDisplay();
