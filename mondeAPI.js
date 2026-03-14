const axios = require("axios");

const API = "https://web.monde.com.br/api/v2";

const LOGIN = "madeintrip.monde.com.br";
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

async function criarCliente(dados) {

    if (!token) {
        await autenticar();
    }

    const body = {
        data: {
            type: "people",
            attributes: {
                name: dados["Seu nome completo"] || "Cliente Formulário",
                email: dados["E-mail"] || "",
                phone: dados["Celular"] || "",
                "mobile-phone": dados["Celular"] || "",
                kind: "F"
            }
        }
    };

    try {

        const response = await axios.post(
            `${API}/people`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.api+json",
                    "Content-Type": "application/vnd.api+json"
                }
            }
        );

        console.log("Cliente criado no Monde");

        return response.data.data.id;

    } catch (err) {

        console.log("Erro ao criar cliente:");
        console.log(JSON.stringify(err.response.data, null, 2));

        return null;

    }
}

async function criarTarefa(dados) {

    if (!token) {
        await autenticar();
    }

    const clienteId = await criarCliente(dados);

    const descricao = `
Nova solicitação de viagem

Nome: ${dados["Seu nome completo"]}
Celular: ${dados["Celular"]}
Email: ${dados["E-mail"]}
Origem: ${dados["Cidade de origem"]}
Destino: ${dados["Cidade de destino"]}
`;

    const body = {
        data: {
            type: "tasks",
            attributes: {
                title: `Nova cotação - ${dados["Seu nome completo"]}`,
                description: descricao,
                due: dataMonde()
            },
            relationships: {
                category: {
                    data: {
                        id: "Geral",
                        type: "task-categories"
                    }
                },
                assignee: {
                    data: {
                        id: "SEU_ID_DE_USUARIO",
                        type: "people"
                    }
                },
                person: {
                    data: {
                        id: clienteId,
                        type: "people"
                    }
                }
            }
        }
    };

    await axios.post(
        `${API}/tasks`,
        body,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json"
            }
        }
    );

    console.log("Tarefa criada no Monde");

}

module.exports = { criarTarefa };