require("dotenv").config();
const axios = require("axios");

async function gerarToken() {

    try {

        const response = await axios({
            method: "POST",
            url: "https://web.monde.com.br/api/v2/tokens",
            headers: {
                "Content-Type": "application/vnd.api+json",
                "Accept": "application/vnd.api+json"
            },
            data: {
                data: {
                    type: "tokens",
                    attributes: {
                        login: process.env.MONDE_LOGIN || "seu_login",
                        password: process.env.MONDE_PASSWORD || "sua_senha"
                    }
                }
            }
        });

        console.log("TOKEN:");
        console.log(response.data.data.attributes.token);

    } catch (error) {

        console.log("Erro:");

        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

    }

}

gerarToken();