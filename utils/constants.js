const dotenv = require('dotenv').config();
const shopifyApiPublicKey = process.env.SHOPIFY_API_PUBLIC_KEY;
const shopifyApiSecretKey = process.env.SHOPIFY_API_SECRET_KEY;
const appUrl = 'https://509cee43.ngrok.io';
const PORT = 9900
const scopes = 'write_products';

module.exports = {
    shopifyApiPublicKey,
    shopifyApiSecretKey,
    appUrl,
    PORT,
    scopes
}