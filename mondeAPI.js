const axios = require("axios");

const API = "https://web.monde.com.br/api/v2";

const LOGIN = "tiago.reis@mitviagensemilhas.com";
const PASSWORD = "trs@2965234243";

let token = null;

async function autenticar() {

    const response = await axios.post(
        `${API}/tokens`,
        {
            data: {
                type: "tokens",
                attributes: {
                    login: LOGIN,
                    password: PASSWORD
                }
            }
        },
        {
            headers: {
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json"
            }
        }
    );

    token = response.data.data.attributes.token;

    console.log("Token obtido com sucesso");
}

async function criarTarefa(dados) {

    if (!token) {
        await autenticar();
    }

    const descricao = `
Nova solicitação de viagem

Nome: ${dados["Seu nome completo"] || ""}
Celular: ${dados["Celular"] || ""}
Email: ${dados["E-mail"] || ""}

Dados completos:
${JSON.stringify(dados, null, 2)}
`;

    await axios.post(
        `${API}/tasks`,
        {
            data: {
                type: "tasks",
                attributes: {
                    title: `Nova cotação - ${dados["Seu nome completo"] || "Cliente"}`,
                    description: descricao
                },
                relationships: {
                    "task-category": {
                        data: {
                            type: "task-categories",
                            id: "1"
                        }
                    }
                }
            }
        },
        {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json"
            }
        }
    );

    console.log("Tarefa criada no Monde");
}

module.exports = { criarTarefa };