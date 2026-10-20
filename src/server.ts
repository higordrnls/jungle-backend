
import { createServer } from "node:http";

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

const usuarios: Usuario[] = [];
let proximoId = 1;

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost:3000");
  const rota = url.pathname;
  const metodo = req.method;

  // GET /usuarios — listar todos
  if (rota === "/usuarios" && metodo === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
    });

    res.end(JSON.stringify(usuarios));
    return;
  }

  // POST /usuarios — cadastrar usuário
  if (rota === "/usuarios" && metodo === "POST") {
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

    return;
  }

  // Extrair o ID de rotas como /usuarios/1
  const rotaUsuario = rota.match(/^\/usuarios\/(\d+)$/);

  if (rotaUsuario) {
    const id = Number(rotaUsuario[1]);

    if (!Number.isSafeInteger(id) || id < 1) {
      res.writeHead(400, {
        "Content-Type": "text/plain; charset=utf-8",
      });

      res.end("ID inválido");
      return;
    }

    const indice = usuarios.findIndex((usuario) => usuario.id === id);

    // GET /usuarios/:id — buscar um usuário
    if (metodo === "GET") {
      if (indice === -1) {
        res.writeHead(404, {
          "Content-Type": "text/plain; charset=utf-8",
        });

        res.end("Usuário não encontrado");
        return;
      }

      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
      });

      res.end(JSON.stringify(usuarios[indice]));
      return;
    }

    // DELETE /usuarios/:id — excluir um usuário
    if (metodo === "DELETE") {
      if (indice === -1) {
        res.writeHead(404, {
          "Content-Type": "text/plain; charset=utf-8",
        });

        res.end("Usuário não encontrado");
        return;
      }

      const [usuarioRemovido] = usuarios.splice(indice, 1);

      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
      });

      res.end(JSON.stringify(usuarioRemovido));
      return;
    }
  }

  // Nenhuma rota correspondente
  res.writeHead(404, {
    "Content-Type": "text/plain; charset=utf-8",
  });

  res.end("Rota não encontrada");
});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
