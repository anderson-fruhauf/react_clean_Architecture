import { RequiredFieldError } from '@/validation/errors'
import { RequiredFieldValidation } from './RequiredFieldValidation'

describe('RequiredFieldValidation', () => {
  test('Should return error if fild is empty', () => {
    const sut = new RequiredFieldValidation('email')
    const error = sut.validate('')
    expect(error).toEqual(new RequiredFieldError())
  })
})
