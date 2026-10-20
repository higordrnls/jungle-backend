export class ErroUsuario extends Error {
  constructor(
    mensagem: string,
    public status: 400 | 404
  ) {
    super(mensagem);
    this.name = "ErroUsuario";
  }
}