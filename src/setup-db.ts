import { pool } from "./db";

async function prepararBanco() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL
      );
    `);

    console.log("Tabela usuarios criada ou já existente.");
  } catch (erro) {
    console.error("Erro ao preparar o banco:", erro);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

prepararBanco();