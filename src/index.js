const fs = require("fs");
const { google } = require("googleapis");

const credentials = JSON.parse(
  fs.readFileSync("./credentials.json").toString()
);

const auth = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  "http://localhost"
);

auth.setCredentials(tokens);

// Create Gmail client
const gmail = google.gmail({ version: "v1", auth });

const userId = "hanscpoo@welinux.cl";
gmail.users.messages
  .list({
    userId,
    maxResults: 10,
  })
  .then((res) => {
    const messages = res.data.messages;

    for (const message of messages) {
      gmail.users.messages
        .get({
          userId,
          id: message.id,
        })
        .then((msg) => console.log(`Subject: ${msg.data.headers["Ssubject}`))
        .catch((error) => console.log(error.message));
    }
  });
