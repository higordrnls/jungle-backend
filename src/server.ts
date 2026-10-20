
import { createServer } from "node:http";
import { tratarRotas } from "./routes/usuarioRoutes";

const server = createServer((req, res) => {
  void tratarRotas(req, res);
});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
