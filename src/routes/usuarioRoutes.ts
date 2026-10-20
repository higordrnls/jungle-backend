
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  atualizarUsuario,
  buscarUsuario,
  criarUsuario,
  excluirUsuario,
  listarUsuarios,
  ErroUsuario,
} from "../services/usuarioService";

type Resposta = ServerResponse<IncomingMessage>;

function responder(
  res: Resposta,
  status: number,
  dados: unknown
): void {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
  });

  res.end(JSON.stringify(dados));
}

function lerBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new ErroUsuario("JSON inválido", 400));
      }
    });

    req.on("error", reject);
  });
}

export async function tratarRotas(
  req: IncomingMessage,
  res: Resposta
): Promise<void> {
  const url = new URL(req.url ?? "/", "http://localhost:3000");
  const rota = url.pathname;
  const metodo = req.method;

  try {
    if (rota === "/usuarios" && metodo === "GET") {
      responder(res, 200, await listarUsuarios());
      return;
    }

    if (rota === "/usuarios" && metodo === "POST") {
      const dados = await lerBody(req);
      responder(res, 201, await criarUsuario(dados));
      return;
    }

    const correspondencia = rota.match(/^\/usuarios\/(\d+)$/);

    if (correspondencia) {
      const id = Number(correspondencia[1]);

      if (!Number.isSafeInteger(id) || id < 1) {
        throw new ErroUsuario("ID inválido", 400);
      }

      if (metodo === "GET") {
        responder(res, 200, await buscarUsuario(id));
        return;
      }

      if (metodo === "PUT") {
        const dados = await lerBody(req);
        responder(res, 200, await atualizarUsuario(id, dados));
        return;
      }

      if (metodo === "DELETE") {
        responder(res, 200, await excluirUsuario(id));
        return;
      }
    }

    responder(res, 404, { mensagem: "Rota não encontrada" });
  } catch (erro) {
    if (erro instanceof ErroUsuario) {
      responder(res, erro.status, { mensagem: erro.message });
      return;
    }

    console.error("Erro interno:", erro);
    responder(res, 500, { mensagem: "Erro interno do servidor" });
  }
}
