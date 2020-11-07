import faker from 'faker'
import { ValidationComposite } from './validation-composite'
import { FieldValidationSpy } from '@/validation/test/FieldValidationSpy'

type SutTypes = {
  sut: ValidationComposite
  fieldValidatioSpys: FieldValidationSpy[]
  fieldName: string
}

const makeSut = (fieldName: string = faker.database.column()): SutTypes => {
  const fieldValidatioSpys = [new FieldValidationSpy(fieldName), new FieldValidationSpy(fieldName)]
  const sut = ValidationComposite.builder(fieldValidatioSpys)
  return { sut, fieldValidatioSpys, fieldName }
}

describe('ValidationComposite', () => {
  test('should return error if any validation fails', () => {
    const { sut, fieldValidatioSpys, fieldName } = makeSut()
    const errorMessage = faker.random.words(4)
    fieldValidatioSpys[0].validate.mockReturnValue(new Error(errorMessage))
    const error = sut.validate(fieldName, faker.random.word())
    expect(error).toBe(errorMessage)
    expect(fieldValidatioSpys[1].validate).not.toHaveBeenCalled()
  })

  test('should return falsy if validation not fails', () => {
    const { sut, fieldValidatioSpys, fieldName } = makeSut()
    const error = sut.validate(fieldName, faker.random.word())
    expect(error).toBeFalsy()
    expect(fieldValidatioSpys[1].validate).toHaveBeenCalled()
  })
})
