import { FieldValidation } from '@/validation/protocols'

export class FieldValidationSpy implements FieldValidation {
  constructor (readonly field: string) { }
  validate = jest.fn()
}
