import faker from 'faker'
import { ValidationComposite } from './validation-composite'
import { FieldValidationSpy } from '@/validation/test/FieldValidationSpy'

describe('ValidationComposite', () => {
  test('should return error if any validation fails', () => {
    const validatorSpy = new FieldValidationSpy('fieldName')
    const validatorSpy2 = new FieldValidationSpy('fieldName')
    const sut = new ValidationComposite([validatorSpy, validatorSpy2])
    validatorSpy.validate.mockReturnValue(new Error('any_message'))
    const error = sut.validate('fieldName', 'any_value')
    expect(error).toBe('any_message')
    expect(validatorSpy2.validate).not.toHaveBeenCalled()
  })
})
