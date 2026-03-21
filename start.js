// inicia o servidor
try {
    console.log("Iniciando servidor...");

    require("./server");

    console.log("Servidor iniciado com sucesso!");

} catch (err) {
    console.error("Erro ao iniciar servidor:");
    console.error(err);
}

// captura erros globais (evita fechar sozinho)
process.on("uncaughtException", (err) => {
    console.error("ERRO NÃO TRATADO:");
    console.error(err);
});

process.on("unhandledRejection", (err) => {
    console.error("PROMISE REJEITADA:");
    console.error(err);
});