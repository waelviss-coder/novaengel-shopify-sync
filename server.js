require('dotenv').config();
const express = require('express');
const syncRoute = require('./routes/sync');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('NovaEngel Shopify Sync App'));

app.post('/api/sync', syncRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
