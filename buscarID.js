const axios = require("axios");

const API = "https://web.monde.com.br/api/v2";
const TOKEN = "madeintrip.monde.com.br";

async function buscar() {

    const response = await axios.get(
        `${API}/people`,
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json"
            }
        }
    );

    response.data.data.forEach(pessoa => {

        console.log("Nome:", pessoa.attributes.name);
        console.log("Email:", pessoa.attributes.email);
        console.log("ID:", pessoa.id);
        console.log("----------------");

    });

}

buscar();