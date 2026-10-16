
import { createInterface } from "node:readline";

const terminal = createInterface({
  input: process.stdin,
  output: process.stdout,
});

terminal.question("Qual é o seu nome? ", (nome) => {
  terminal.question("Qual é o seu e-mail? ", async (email) => {
    try {
      const resposta = await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email }),
      });

      const mensagem = await resposta.text();

      console.log("\nResposta do servidor:");
      console.log("Status:", resposta.status);
      console.log("Mensagem:", mensagem);
    } catch (erro) {
      console.log("Não foi possível conectar ao servidor.");
      console.error(erro);
    } finally {
      terminal.close();
    }
  });
});
