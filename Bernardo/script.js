const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsDiv = document.getElementById('results');

searchButton.addEventListener('click', searchVideos);

function searchVideos() {
  const searchTerm = searchInput.value;
  fetch(`https:                                          
    .then(response => response.json())
    .then(data => {
      const videos = data.videos;
      resultsDiv.innerHTML = '';
      videos.forEach(video => {
        const videoHTML = //api.example.com/videos?q=${searchTerm})
    .then(response => response.json())
    .then(data => {
      const videos = data.videos;
      resultsDiv.innerHTML = '';
      videos.forEach(video => {
        const videoHTML = `
          <div class="video">
            <h2 class="video-title">${video.title}</h2>
            <p class="video-description">${video.description}</p>
          </div>
        `;
        resultsDiv.innerHTML += videoHTML;
      });
    })
    .catch(error => console.error(error));
}