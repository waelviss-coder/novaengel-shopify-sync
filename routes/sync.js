const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const token = process.env.NOVA_ENGEL_TOKEN;

        // 1️⃣ Récupérer stock Nova Engel
        const novaStockResp = await axios.get(`https://drop.novaengel.com/api/stock/update/${token}`);
        const novaStock = novaStockResp.data;

        // 2️⃣ Récupérer produits Shopify
        const shopifyResp = await axios.get(
            `https://${process.env.SHOPIFY_STORE}/admin/api/2024-10/products.json`,
            { headers: { 'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN } }
        );
        const products = shopifyResp.data.products;

        // 3️⃣ Mettre à jour le stock
        for (const product of products) {
            for (const variant of product.variants) {
                const sku = variant.sku.trim();
                const stock = novaStock.find(item => item.Id == sku)?.Stock || 0;

                if (variant.inventory_quantity !== stock) {
                    await axios.post(
                        `https://${process.env.SHOPIFY_STORE}/admin/api/2024-10/inventory_levels/set.json`,
                        {
                            location_id: process.env.SHOPIFY_LOCATION_ID,
                            inventory_item_id: variant.inventory_item_id,
                            available: stock
                        },
                        { headers: { 'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN } }
                    );
                }
            }
        }

        res.json({ status: 'success', message: 'Stock synchronized' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};
