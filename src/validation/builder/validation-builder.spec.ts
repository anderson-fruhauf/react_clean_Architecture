import { ValidationBuilder } from './validation-builder'
import { EmailValidation, RequiredFieldValidation, MinLengthValidator } from '@/validation/validators'
import faker from 'faker'

describe('ValidatorBuilder', () => {
  const fieldName = faker.database.column()
  const minLength = faker.random.number(15)
  test('Should return RequiredFieldValidation', () => {
    const validators = ValidationBuilder.field(fieldName).required().build()
    expect(validators).toEqual([new RequiredFieldValidation(fieldName)])
  })

  test('Should return EmailValidation', () => {
    const validators = ValidationBuilder.field(fieldName).email().build()
    expect(validators).toEqual([new EmailValidation(fieldName)])
  })

  test('Should return MinLengthValidator', () => {
    const validators = ValidationBuilder.field(fieldName).min(minLength).build()
    expect(validators).toEqual([new MinLengthValidator(fieldName, minLength)])
  })

  test('Should return list of validation', () => {
    const validators = ValidationBuilder.field(fieldName).email().required().min(minLength).build()
    expect(validators).toEqual([
      new EmailValidation(fieldName),
      new RequiredFieldValidation(fieldName),
      new MinLengthValidator(fieldName, minLength)
    ])
  })
})
