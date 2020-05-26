const express = require('express');
const axios = require('axios');
const http = require('http');

const app = express();
const server = new http.Server(app);
const port = process.env.PORT || 3000;

app.use(express.json());

const convertCurrency = async ({ amount, currency }, outputCurrency, cb) => {
  try {
    const data = await JSON.parse(axios.get(`http://data.fixer.io/api/latest?access_key=${process.env.ACCESS_KEY}&base=${currency}&symbols=${outputCurrency}`));
    const computedValue = Math.round(data.body.rates[outputCurrency] * amount);
    cb(null, `${amount} ${currency} converts to about ${outputCurrency} ${computedValue} as per current rates!`);
  } catch (e) {
    cb(e, null);
  }
};

app.post('/', (req, res) => {
  const { queryResult } = req.body;
  if (queryResult.action === 'convert') {
    const { outputCurrency, amountToConvert } = queryResult.parameters;

    if (amountToConvert.currency === outputCurrency) {
      const { amount, currency } = amountToConvert;
      const response = `Well ${amount} ${currency} is obviously equal to ${amount} ${currency}`;
      res.send({
        fulfillmentMessages: [
          {
            text: {
              text: [
                response
              ]
            }
          }
        ]
      });
    }
  } else {
      res.send({
        fulfillmentMessages: [
          {
            text: {
              text: [
                convertCurrency(amountToConvert, outputCurrency)
              ]
            }
          }
        ]
      });
    }
  }
);

server.listen(port, () => {
  console.log(`Running on port ${port}`);
});
