export class InvalidFieldErro extends Error {
  constructor () {
    super('Valor inválido')
    this.name = 'InvalidFieldErro'
  }
}
