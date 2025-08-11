const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('API YouTube Downloader funcionando!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
