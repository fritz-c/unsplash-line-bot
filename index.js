const express = require('express');
const line = require('@line/bot-sdk');
global.fetch = require('node-fetch');
const { default: Unsplash, toJson } = require('unsplash-js');

const unsplash = new Unsplash({
  applicationId:
    'aa3680a0ca835e15851c397f6e77140ab46a379951e35a191a82b78bd6239bf2',
  secret: process.env.UNSPLASH_SECRET,
  callbackUrl: '',
});

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

  const text = 'No results found';
  // if (event.message.text.match(/rain/i)) {
  //   text = 'How should I know if it will rain? Jerk.';
  // }

  return unsplash.search
    .all(event.message.text.split(' ')[0], 0, 1)
    .then(toJson)
    .then(json => {
      let responses = [{ type: 'text', text }];
      if (json.photos.results.length > 0) {
        const {
          user,
          links: { html: pageLink },
          urls,
        } = json.photos.results[0];
        const attribution =
          '?utm_source=Line+Photo+Chat&utm_medium=referral&utm_campaign=api-credit';
        responses = [
          {
            type: 'image',
            previewImageUrl: urls.thumb,
            originalContentUrl: urls.small,
          },
          {
            type: 'text',
            text: `See full size photo at ${pageLink}${
              attribution
            }\n<Photo by ${user.name || user.username}/Unsplash (${
              user.links.html
            }${attribution})>`,
          },
        ];
      }

      return client.replyMessage(event.replyToken, responses);
    });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
