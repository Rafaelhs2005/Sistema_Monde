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
                        login: "madeintrip.monde.com.br",
                        password: "trs@2965234243"
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