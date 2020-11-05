import { InvalidFieldErro } from '@/validation/errors'
import { FieldFalidation } from '@/validation/protocols'

export class EmailValidation implements FieldFalidation {
  constructor(readonly field: string) { }

  validate(value: string): Error {
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    return emailRegex.test(value) ? null : new InvalidFieldErro()
  }
}
