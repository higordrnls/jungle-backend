
import { createServer } from "node:http";

const server = createServer((req, res) => {
  if (req.url === "/usuarios" && req.method === "GET") {
    res.writeHead(200);
    res.end("Lista de usuários");
  } else if (req.url === "/usuarios" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const usuario = JSON.parse(body);

        const nome = usuario.nome;
const email = usuario.email;

if (
  typeof nome !== "string" ||
  nome.trim() === "" ||
  typeof email !== "string" ||
  !email.includes("@") ||
  email.startsWith("@") ||
  email.endsWith("@")
) {
  res.writeHead(400, {
    "Content-Type": "text/plain; charset=utf-8",
  });
  res.end("Nome ou email inválido");
  return;
}

        console.log("Nome:", usuario.nome);
        console.log("Email:", usuario.email);

        res.writeHead(200, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        res.end("Dados recebidos!");
      } catch {
        res.writeHead(400, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        res.end("JSON inválido");
      }
    });
  } else {
    res.writeHead(404);
    res.end("Rota não encontrada");
  }
});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
