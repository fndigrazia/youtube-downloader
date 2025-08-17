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
      const card = document.createElement("div");
      card.className = "video-card";
      card.innerHTML = `
        <img class="thumbnail" src="${video.thumbnails[0].url}" alt="${video.title}">
        <div class="video-info">
          <div class="video-title">${video.title}</div>
          <div class="video-channel">${video.channel || "Canal desconocido"}</div>
          <div class="video-meta">${video.duration || "?"} • ${video.views || "?"} vistas</div>
        </div>
      `;
      card.addEventListener("click", () => {
        window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank");
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
