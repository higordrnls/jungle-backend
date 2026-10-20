
import { pool } from "../db";
import type { Usuario } from "../types/usuario";

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

export async function listarUsuarios(): Promise<Usuario[]> {
  const resultado = await pool.query(
    "SELECT id, nome, email FROM usuarios ORDER BY id"
  );

  return resultado.rows;
}

export async function buscarUsuario(id: number): Promise<Usuario> {
  const resultado = await pool.query(
    "SELECT id, nome, email FROM usuarios WHERE id = $1",
    [id]
  );

  if (resultado.rows.length === 0) {
    throw new ErroUsuario("Usuário não encontrado", 404);
  }

  return resultado.rows[0];
}

export async function criarUsuario(dados: unknown): Promise<Usuario> {
  const dadosValidados = validarDados(dados);

  const resultado = await pool.query(
    `INSERT INTO usuarios (nome, email)
     VALUES ($1, $2)
     RETURNING id, nome, email`,
    [dadosValidados.nome, dadosValidados.email]
  );

  return resultado.rows[0];
}

export async function atualizarUsuario(
  id: number,
  dados: unknown
): Promise<Usuario> {
  const dadosValidados = validarDados(dados);

  const resultado = await pool.query(
    `UPDATE usuarios
     SET nome = $1, email = $2
     WHERE id = $3
     RETURNING id, nome, email`,
    [dadosValidados.nome, dadosValidados.email, id]
  );

  if (resultado.rows.length === 0) {
    throw new ErroUsuario("Usuário não encontrado", 404);
  }

  return resultado.rows[0];
}

export async function excluirUsuario(id: number): Promise<Usuario> {
  const resultado = await pool.query(
    `DELETE FROM usuarios
     WHERE id = $1
     RETURNING id, nome, email`,
    [id]
  );

  if (resultado.rows.length === 0) {
    throw new ErroUsuario("Usuário não encontrado", 404);
  }

  return resultado.rows[0];
}
