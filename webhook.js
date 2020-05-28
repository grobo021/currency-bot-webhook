const express = require('express');
const axios = require('axios');
const http = require('http');

const app = express();
const server = new http.Server(app);
const port = process.env.PORT || 3000;

app.use(express.json());

const convertCurrency = async ({ amount, currency }, outputCurrency, cb) => {
  try {
    const data = await axios.get(`https://free.currconv.com/api/v7/convert?q=${currency}_${outputCurrency}&compact=ultra&apiKey=${process.env.ACCESS_KEY}`);
    const computedValue = Math.round(data.data[`${currency}_${outputCurrency}`] * amount);
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
    } else {
      convertCurrency(amountToConvert, outputCurrency, (error, result) => {
        if (!error && result) {
          res.send({
            fulfillmentMessages: [
              {
                text: {
                  text: [
                    result
                  ]
                }
              }
            ]
          });
        } else {
          console.log(error);
        }
      });
    }
  }
});

server.listen(port, () => {
  console.log(`Running on port ${port}`);
});
