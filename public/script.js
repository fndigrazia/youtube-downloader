const closeOverlay = document.getElementById("closeOverlay");
const overlay = document.getElementById("videoOverlay");



document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = document.getElementById("searchInput").value.trim();
  console.log(query);
  if (!query) return;

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Buscando...</p>";

  try {
    const res = await fetch(`/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    console.log(data);
    resultsDiv.innerHTML = "";

    data.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';
      
        const div_img = document.createElement('div');
        div_img.className = 'card-img';
        
        const img = document.createElement('img');
        img.src = video.thumbnails[0].url;
        div_img.appendChild(img);
        

        const content = document.createElement('div');
        content.className = 'video-info';

        const title = document.createElement('h3');
        title.textContent = video.title;

        const info = document.createElement('p');
        info.textContent = `${video.channel} • ${video.view_count} • ${video.duration}`;

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.textContent = 'Download';
        downloadBtn.onclick = () => {
            window.location.href = `/download?id=${video.id}`;
        };

        content.appendChild(title);
        content.appendChild(info);
        content.appendChild(downloadBtn);

        card.appendChild(div_img);
        card.appendChild(content);
        
        // click en card = abrir overlay
        card.addEventListener("click", () => {
          videoPlayer.src = `https://www.youtube.com/embed/${video.id}?autoplay=1`;
          overlay.classList.remove("hidden");
        });
        resultsDiv.appendChild(card);
    });

    if (data.length === 0) {
      resultsDiv.innerHTML = "<p>No se encontraron resultados.</p>";
    }

  } catch (err) {
    resultsDiv.innerHTML = "<p>Error al buscar videos.</p>";
    console.error(err);
  }
});

// cerrar overlay
closeOverlay.addEventListener("click", () => {
  videoPlayer.src = "";
  overlay.classList.add("hidden");
});