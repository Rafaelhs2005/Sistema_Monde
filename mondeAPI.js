const axios = require("axios");

const API = "https://web.monde.com.br/api/v2";

const LOGIN = "tiago.reis@madeintrip.monde.com.br";
const PASSWORD = "Trs@2965234243";

let token = null;

function getCampo(dados, nomeParcial) {
    const chave = Object.keys(dados).find(k => k.includes(nomeParcial));
    return chave ? dados[chave] : "";
}

function dataMonde() {
    const agora = new Date();

    const offset = -3;
    agora.setHours(agora.getHours() + offset);

    const iso = agora.toISOString().replace("Z", "-03:00");

    return iso;
}

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

    const destino = dados["Cidade de destino"] || "Destino não informado";

    const descricao = `
Nova solicitação de viagem

Destino: ${destino}
Destino (repetido): ${destino}

Nome: ${getCampo(dados, "nome")}
Celular: ${getCampo(dados, "Celular")}
Email: ${getCampo(dados, "E-mail")}

Origem: ${getCampo(dados, "origem")}
Destino: ${getCampo(dados, "destino")}

Ida: ${getCampo(dados, "ida")}
Volta: ${getCampo(dados, "volta")}

Flexibilidade de datas: ${getCampo(dados, "flexibilidade")}

Bagagem despachada: ${getCampo(dados, "bagagem")}

Adultos: ${getCampo(dados, "adultos")}
Crianças: ${getCampo(dados, "crianças")}

Serviços adicionais: ${(getCampo(dados, "Serviços") || []).join(", ")}
Transporte: ${(getCampo(dados, "transporte") || []).join(", ")}

Informações adicionais:
${getCampo(dados, "Informações adicionais")}
`;

    const body = {
        data: {
            type: "tasks",
            attributes: {
                title: destino,
                description: descricao,
                due: dataMonde()
            },
            relationships: {
                category: {
                    data: {
                        id: "Aguardando",
                        type: "task-categories"
                    }
                },
                assignee: {
                    data: {
                        id: "4298475b-8b2b-4396-9f0c-a534eed4768a",
                        type: "people"
                    }
                }
            }
        }
    };

    try {

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

        console.log("Tarefa criada com sucesso");

    } catch (err) {

        console.log("Erro ao criar tarefa:");
        console.log(JSON.stringify(err.response.data, null, 2));

    }
}

module.exports = { criarTarefa };