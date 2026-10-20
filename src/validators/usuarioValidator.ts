import { ErroUsuario } from "../errors/ErroUsuario";

export function validarDados(dados: unknown): {
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