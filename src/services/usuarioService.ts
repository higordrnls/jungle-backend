
import type { Usuario } from "../types/usuario";

const usuarios: Usuario[] = [];
let proximoId = 1;

export class ErroUsuario extends Error {
  constructor(
    mensagem: string,
    public status: 400 | 404
  ) {
    super(mensagem);
  }
}

function validarDados(dados: unknown): {
  nome: string;
  email: string;
} {
  if (typeof dados !== "object" || dados === null) {
    throw new ErroUsuario("Dados inválidos", 400);
  }

  const registro = dados as Record<string, unknown>;
  const nome = registro.nome;
  const email = registro.email;

  if (
    typeof nome !== "string" ||
    nome.trim() === "" ||
    typeof email !== "string" ||
    !email.trim().includes("@") ||
    email.trim().startsWith("@") ||
    email.trim().endsWith("@")
  ) {
    throw new ErroUsuario("Nome ou email inválido", 400);
  }

  return {
    nome: nome.trim(),
    email: email.trim(),
  };
}

export function listarUsuarios(): Usuario[] {
  return usuarios;
}

export function buscarUsuario(id: number): Usuario {
  const usuario = usuarios.find((item) => item.id === id);

  if (!usuario) {
    throw new ErroUsuario("Usuário não encontrado", 404);
  }

  return usuario;
}

export function criarUsuario(dados: unknown): Usuario {
  const dadosValidados = validarDados(dados);

  const novoUsuario: Usuario = {
    id: proximoId,
    ...dadosValidados,
  };

  usuarios.push(novoUsuario);
  proximoId++;

  return novoUsuario;
}

export function atualizarUsuario(
  id: number,
  dados: unknown
): Usuario {
  const indice = usuarios.findIndex((item) => item.id === id);

  if (indice === -1) {
    throw new ErroUsuario("Usuário não encontrado", 404);
  }

  const dadosValidados = validarDados(dados);

  const usuarioAtualizado: Usuario = {
    id,
    ...dadosValidados,
  };

  usuarios[indice] = usuarioAtualizado;

  return usuarioAtualizado;
}

export function excluirUsuario(id: number): Usuario {
  const indice = usuarios.findIndex((item) => item.id === id);

  if (indice === -1) {
    throw new ErroUsuario("Usuário não encontrado", 404);
  }

  const [usuarioRemovido] = usuarios.splice(indice, 1);

  return usuarioRemovido;
}
