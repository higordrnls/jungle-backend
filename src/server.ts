
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

        if (!validarUsuario(nome, email)) {
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

  // Rotas /usuarios/:id
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

    // GET /usuarios/:id — buscar usuário
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

    // PUT /usuarios/:id — atualizar usuário
    if (metodo === "PUT") {
      if (indice === -1) {
        res.writeHead(404, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        res.end("Usuário não encontrado");
        return;
      }

      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        try {
          const dados = JSON.parse(body);
          const nome = dados.nome;
          const email = dados.email;

          if (!validarUsuario(nome, email)) {
            res.writeHead(400, {
              "Content-Type": "text/plain; charset=utf-8",
            });
            res.end("Nome ou email inválido");
            return;
          }

          const usuarioAtualizado: Usuario = {
            id,
            nome: nome.trim(),
            email: email.trim(),
          };

          usuarios[indice] = usuarioAtualizado;

          res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8",
          });
          res.end(JSON.stringify(usuarioAtualizado));
        } catch {
          res.writeHead(400, {
            "Content-Type": "text/plain; charset=utf-8",
          });
          res.end("JSON inválido");
        }
      });

      return;
    }

    // DELETE /usuarios/:id — excluir usuário
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

  res.writeHead(404, {
    "Content-Type": "text/plain; charset=utf-8",
  });
  res.end("Rota não encontrada");
});

function validarUsuario(nome: unknown, email: unknown): boolean {
  return (
    typeof nome === "string" &&
    nome.trim() !== "" &&
    typeof email === "string" &&
    email.trim().includes("@") &&
    !email.trim().startsWith("@") &&
    !email.trim().endsWith("@")
  );
}

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
