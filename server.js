const express = require('express');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');

const app = express();

const { 
    PORT, 
    shopifyApiPublicKey, 
    shopifyApiSecretKey 
} = require('./utils/constants')

const {
    buildRedirectUri, 
    buildInstallUrl, 
    generateEncryptedHash, 
    fetchAccessToken, 
    fetchShopData 
} = require('./utils/helperFunctions');

app.get('/', (req, res) => {
    res.send('hello world...')
  });


app.get('/shopify', (req, res) => {
  const shop = req.query.shop;

  if (!shop) { return res.status(400).send('no shop')}

  const state = nonce();

  const installShopUrl = buildInstallUrl(shop, state, buildRedirectUri())

  res.cookie('state', state) 
  res.redirect(installShopUrl);
});


app.get('/shopify/callback', async (req, res) => {
  const { shop, code, state } = req.query;
  const stateCookie = cookie.parse(req.headers.cookie).state;

  if (state !== stateCookie) { return res.status(403).send('Cannot be verified')}

  const { hmac, ...params } = req.query
  const queryParams = querystring.stringify(params)
  const hash = generateEncryptedHash(queryParams)

  if (hash !== hmac) { return res.status(400).send('HMAC validation failed')}

  try {
    const data = {
      client_id: shopifyApiPublicKey,
      client_secret: shopifyApiSecretKey,
      code
    };
    const tokenResponse = await fetchAccessToken(shop, data)

    const { access_token } = tokenResponse.data

    const shopData = await fetchShopData(shop, access_token)
    res.send(shopData.data.shop)

  } catch(err) {
    console.log(err)
    res.status(500).send('something went wrong')
  }
});


app.listen(PORT, () => console.log(`listening on port ${PORT}`));
