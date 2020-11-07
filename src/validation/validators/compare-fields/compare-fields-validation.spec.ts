import { InvalidFieldErro } from '@/validation/errors'
import faker from 'faker'
import { CompareFieldValidation } from './compare-fields-validation'

const makeSut = (valueToCompare: string = faker.random.word()): CompareFieldValidation =>
  new CompareFieldValidation(faker.database.column(), valueToCompare)

describe('EmailValidation', () => {
  test('Should return error if compare is invalid', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.word())
    expect(error).toEqual(new InvalidFieldErro())
  })

  test('Should return falsy if compare is not invalid', () => {
    const valueToCompare = faker.random.word()
    const sut = makeSut(valueToCompare)
    const error = sut.validate(valueToCompare)
    expect(error).toBeFalsy()
  })
})
