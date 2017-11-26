const express = require('express');
const line = require('@line/bot-sdk');
const port = process.env.PORT || 3000;

const config = {
  channelAccessToken:
    'vJJozQhcnDUhNUWoj4U2h7fAkEYr3DmWpV3k1oUcyPR5nfEX2Kk311bi/fNRPml+6RgKuVPjgQLNN8YtppRG65C5ps5ImEjMl5+FjFpUKpTxE3CpyifqK0HHJ7JMxDpDwDATCJ9JjBsHQfqumi9MNAdB04t89/1O/w1cDnyilFU=',
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
  console.log(req.body.events);
  Promise.all(req.body.events.map(handleEvent)).then(result =>
    res.json(result)
  );
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let text = "Sorry, I don't understand...";
  if (event.message.text.match(/rain/i)) {
    text = "How should I know if it will rain? Jerk."
  }

  return client.replyMessage(event.replyToken, { type: 'text', text });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
