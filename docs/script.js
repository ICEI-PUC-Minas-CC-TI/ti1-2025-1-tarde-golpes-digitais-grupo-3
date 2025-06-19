let likeData = {
    liked: false,
    count: 0
};

const likeBtn = document.getElementById("like-btn");
const likeCount = document.getElementById("like-count");

function updateUI() {
    if (likeData.liked) {
        likeBtn.classList.add("liked");
    } else {
        likeBtn.classList.remove("liked");
    }
    likeCount.textContent = likeData.count;
}

likeBtn.addEventListener("click", () => {
    likeData.liked = !likeData.liked;
    likeData.count += likeData.liked ? 1 : -1;
    updateUI();
});

updateUI();