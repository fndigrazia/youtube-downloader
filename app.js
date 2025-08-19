const express = require('express');
const path = require('path');
const app = express();
const { exec } = require('child_process');

app.use(express.static(path.join(__dirname, 'public')));

// index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(express.json());

// busca videos de youtube por string
app.get("/search", async (req, res) => {
    
    const query = req.query.query;
    if (!query) {
    return res.status(400).json({ error: "Debe enviar un parámetro q con el texto de búsqueda" });
    }

    // utilizamos yt-dlp para buscar videos
    
    const cmd = `yt-dlp "ytsearch10:${query}" -J --flat-playlist`;
    console.log("ejecutando comando:", cmd);
    exec(cmd, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: stderr });
        try {
            const data = JSON.parse(stdout);
            console.log(data);
            res.json(data.entries);
        } catch (e) {
            res.status(500).json({ error: "Error parseando JSON" });
        }
    });
});

// ruta para descargar videos
app.get('/download', (req, res) => {
    const videoId = req.query.id;
    if (!videoId) return res.status(400).send("Falta el id del video");

    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const filename = `${videoId}.mp4`;

    console.log(`Descargando video: ${url}`);

    // temporalmente guardamos el archivo
    const outputPath = path.join(__dirname, filename);
    const cmd = `yt-dlp -f mp4 -o "${outputPath}" ${url}`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error("Error al descargar:", stderr);
            return res.status(500).send("Error al descargar video");
        }

        // Lo enviamos al navegador como descarga
        res.download(outputPath, filename, (err) => {
            if (err) console.error("Error enviando archivo:", err);
        });
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
