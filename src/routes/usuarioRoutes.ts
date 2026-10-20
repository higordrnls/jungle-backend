import type { IncomingMessage, ServerResponse } from "node:http";
import {
  listarUsuarios,
  buscarUsuario,
  criarUsuario,
  atualizarUsuario,
  excluirUsuario,
} from "../services/usuarioService";
import { ErroUsuario } from "../errors/ErroUsuario";

function responder(
  res: ServerResponse,
  status: number,
  dados: unknown
): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(dados));
}

async function lerCorpo(req: IncomingMessage): Promise<unknown> {
  let corpo = "";

  for await (const parte of req) {
    corpo += parte;
  }

  try {
    return JSON.parse(corpo);
  } catch {
    throw new ErroUsuario("JSON inválido", 400);
  }
}

export async function tratarRotas(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const metodo = req.method ?? "GET";
  const url = new URL(req.url ?? "/", "http://localhost");
  const caminho = url.pathname;

  try {
    if (caminho === "/usuarios" && metodo === "GET") {
      const usuarios = await listarUsuarios();
      responder(res, 200, usuarios);
      return;
    }

    if (caminho === "/usuarios" && metodo === "POST") {
      const dados = await lerCorpo(req);
      const usuario = await criarUsuario(dados);
      responder(res, 201, usuario);
      return;
    }

    const correspondencia = caminho.match(/^\/usuarios\/(\d+)$/);

    if (correspondencia) {
      const id = Number(correspondencia[1]);

      if (metodo === "GET") {
        const usuario = await buscarUsuario(id);
        responder(res, 200, usuario);
        return;
      }

      if (metodo === "PUT") {
        const dados = await lerCorpo(req);
        const usuario = await atualizarUsuario(id, dados);
        responder(res, 200, usuario);
        return;
      }

      if (metodo === "DELETE") {
        const usuario = await excluirUsuario(id);
        responder(res, 200, usuario);
        return;
      }
    }

    responder(res, 404, { mensagem: "Rota não encontrada" });
  } catch (erro: unknown) {
    if (erro instanceof ErroUsuario) {
      responder(res, erro.status, { mensagem: erro.message });
      return;
    }

    console.error("Erro interno:", erro);
    responder(res, 500, { mensagem: "Erro interno do servidor" });
  }
}