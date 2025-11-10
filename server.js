const express = require('express');
const syncRoute = require('./routes/sync');

const app = express();
const PORT = process.env.PORT || 10000;

// Route principale
app.get('/', (req, res) => {
    res.send('NovaEngel Shopify Sync App');
});

// Route pour synchroniser le stock
app.get('/sync', async (req, res) => {
    await syncRoute(req, res);
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
