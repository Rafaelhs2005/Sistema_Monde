const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});

async function pegarRespostas() {

  const client = await auth.getClient();

  const sheets = google.sheets({
    version: "v4",
    auth: client
  });

  const spreadsheetId = "1oalwmRHcqaZt93N4Xy7azgm0kX9gVe4OYUr_ZxGt_zg";

  const range = "'Respostas ao formulário 1'!A1:P";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range
  });

  return response.data.values;
}

module.exports = { pegarRespostas };