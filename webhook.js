const express = require('express');
const http = require('http');

const app = express();
const server = new http.Server(app);
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    console.log('####### App Started ######');
    res.send('App started');
});

app.post('/', (req, res) => {
    const { queryResult } = req.body;
    console.log(`1111111 ${queryResult} 1111111`);
    if (queryResult.action === 'convert') {
        const { outputCurrency, amountToConvert } = queryResult.parameters;
        console.log(`2222222 ${queryResult.parameters} 2222222`);

        if (amountToConvert.currency === outputCurrency) {
            const { amount, currency } = amountToConvert;
            const response = `Well ${amount} ${currency} is obviously equal to ${amount} ${currency}`;
            console.log(`3333333 ${response} 3333333`);
            res.send({
                speech: response,
                displayText: response,
                source: 'moneybot-webhook'
            });
        }
    }
});

server.listen(port, () => {
    console.log(`Running on port ${port}`);
});
