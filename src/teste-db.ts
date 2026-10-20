import { pool } from "./db";

async function testarConexao() {
  try {
    const resultado = await pool.query(
      "SELECT current_database() AS banco, NOW() AS horario"
    );

    console.log("Conexão com PostgreSQL funcionando!");
    console.log(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao conectar ao PostgreSQL:", erro);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

testarConexao();