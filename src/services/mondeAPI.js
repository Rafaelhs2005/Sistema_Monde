const axios = require("axios");

const API = "https://web.monde.com.br/api/v2";

const LOGIN = process.env.MONDE_LOGIN || "seu_login@dominio.com";
const PASSWORD = process.env.MONDE_PASSWORD || "sua_senha";

let token = null;

function getCampo(dados, nomeParcial) {
    const chave = Object.keys(dados).find(k => k.toLowerCase().includes(nomeParcial.toLowerCase()));
    return chave ? dados[chave] : "";
}

function dataMonde() {
    return new Date().toISOString();
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
    return token;
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

Serviços adicionais: ${[].concat(getCampo(dados, "Serviços") || []).filter(Boolean).join(", ")}
Transporte: ${[].concat(getCampo(dados, "transporte") || []).filter(Boolean).join(", ")}

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
                        id: process.env.MONDE_ASSIGNEE_ID || "ID_DO_RESPONSAVEL",
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

        if (err.response && err.response.status === 401) {
            console.log("Token expirado. Tentando reautenticar...");
            token = null;
            await autenticar();
            
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
            console.log("Tarefa criada com sucesso após reautenticação");
        } else {
            console.log("Erro ao criar tarefa:");
            if (err.response && err.response.data) {
                console.log(JSON.stringify(err.response.data, null, 2));
            } else {
                console.log(err.message);
            }
            throw err;
        }

    }
}

module.exports = { criarTarefa, autenticar };