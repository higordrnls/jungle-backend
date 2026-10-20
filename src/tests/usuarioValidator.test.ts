import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validarDados } from "../validators/usuarioValidator";
import { ErroUsuario } from "../errors/ErroUsuario";

describe("validarDados", () => {
  it("deve aceitar nome e email válidos", () => {
    const resultado = validarDados({
      nome: "  Maria Silva  ",
      email: "  maria@example.com  ",
    });

    assert.deepEqual(resultado, {
      nome: "Maria Silva",
      email: "maria@example.com",
    });
  });

  it("deve rejeitar nome vazio", () => {
    assert.throws(
      () => validarDados({ nome: "   ", email: "maria@example.com" }),
      (erro) => erro instanceof ErroUsuario && erro.status === 400,
    );
  });

  it("deve rejeitar email sem @", () => {
    assert.throws(
      () => validarDados({ nome: "Maria", email: "maria.example.com" }),
      (erro) => erro instanceof ErroUsuario && erro.status === 400,
    );
  });

  it("deve rejeitar dados nulos", () => {
    assert.throws(
      () => validarDados(null),
      (erro) => erro instanceof ErroUsuario && erro.status === 400,
    );
  });
});