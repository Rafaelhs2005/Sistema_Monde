require("dotenv").config();
const axios = require("axios");

const { autenticar } = require("../src/services/mondeAPI");

const API = "https://web.monde.com.br/api/v2";
async function buscar() {
    
    const token = await autenticar();

    const response = await axios.get(
        `${API}/people`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
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