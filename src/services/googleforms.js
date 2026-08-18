const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_CREDENTIALS_PATH || "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});

async function pegarRespostas() {

  const client = await auth.getClient();

  const sheets = google.sheets({
    version: "v4",
    auth: client
  });

  const spreadsheetId = process.env.SPREADSHEET_ID || "SEU_SPREADSHEET_ID_AQUI";

  const range = "'Respostas ao formulário 1'!A1:P";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range
  });

  return response.data.values;
}

module.exports = { pegarRespostas };