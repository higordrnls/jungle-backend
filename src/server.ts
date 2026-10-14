
import { createServer } from "node:http";

const server = createServer((req, res) => {
  res.writeHead(200);
  res.end("Meu primeiro backend está funcionando!");
});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
