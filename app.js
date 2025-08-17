const express = require('express');
const path = require('path');
const app = express();
const { exec } = require('child_process');

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(express.json());
// Dado una cuenta, devuelve las playlists 
app.get("/search", async (req, res) => {
    
    const query = req.query.query;
    if (!query) {
    return res.status(400).json({ error: "Debe enviar un parámetro q con el texto de búsqueda" });
    }

    // Ejecuta yt-dlp para listar playlists en formato JSON
    //const cmd = `yt-dlp --flat-playlist -J https://www.youtube.com/${channel}`;
    
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
