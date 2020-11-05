import { FieldFalidation } from '@/validation/protocols'
import { RequiredFieldError } from '@/validation/errors'

export class RequiredFieldValidation implements FieldFalidation {
  constructor(readonly field: string) { }

  validate(value: string): Error {
    return value.trim() ? null : new RequiredFieldError()
  }
}
