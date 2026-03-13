const fs = require("fs");

const ARQUIVO = "./estado.json";

function carregarEstado() {

    const data = fs.readFileSync(ARQUIVO);

    return JSON.parse(data);

}

function salvarEstado(estado) {

    fs.writeFileSync(ARQUIVO, JSON.stringify(estado, null, 2));

}

module.exports = { carregarEstado, salvarEstado };