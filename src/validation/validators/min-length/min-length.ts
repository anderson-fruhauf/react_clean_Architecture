import { InvalidFieldErro } from '@/validation/errors'
import { FieldValidation } from '@/validation/protocols'

export class MinLengthValidator implements FieldValidation {
  constructor (readonly field: string, private readonly minLength: number) { }

  validate (value: string): Error {
    return (value.trim().length >= this.minLength) ? null : new InvalidFieldErro()
  }
}
