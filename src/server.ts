
import { createServer } from "node:http";

const server = createServer((req, res) => {
  if (req.url === "/usuarios") {
    res.writeHead(200);
    res.end("Lista de usuários");
  } else {
  res.writeHead(404);
  res.end("Rota não encontrada");
  }

});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
