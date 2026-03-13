const express = require("express");
const { criarTarefa } = require("./mondeAPI");

const app = express();

app.use(express.json());

app.post("/formulario", async (req, res) => {

    try {

        const dados = req.body;

        console.log("Resposta recebida:");
        console.log(dados);

        await criarTarefa(dados);

        res.send({ status: "tarefa criada no Monde" });

    } catch (erro) {

        console.error("Erro:", erro.response?.data || erro.message);

        res.status(500).send({
            erro: "Falha ao criar tarefa"
        });

    }

});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});