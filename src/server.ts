
import { createServer } from "node:http";

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

const usuarios: Usuario[] = [];
let proximoId = 1;

const server = createServer((req, res) => {
  if (req.url === "/usuarios" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
    });

    res.end(JSON.stringify(usuarios));
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

        const novoUsuario: Usuario = {
          id: proximoId,
          nome: nome.trim(),
          email: email.trim(),
        };

        usuarios.push(novoUsuario);
        proximoId++;

        console.log("Usuário cadastrado:", novoUsuario);

        res.writeHead(201, {
          "Content-Type": "application/json; charset=utf-8",
        });

        res.end(JSON.stringify(novoUsuario));
      } catch {
        res.writeHead(400, {
          "Content-Type": "text/plain; charset=utf-8",
        });

        res.end("JSON inválido");
      }
    });
  } else {
    res.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8",
    });

    res.end("Rota não encontrada");
  }
});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
