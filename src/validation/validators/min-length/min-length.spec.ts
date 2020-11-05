import { MinLengthValidator } from './min-length'
import faker from 'faker'
import { InvalidFieldErro } from '@/validation/errors'

const makeSut = (minLength: number): MinLengthValidator => new MinLengthValidator(faker.database.column(), minLength)

describe('MinLegthValidator', () => {
  test('Should return error if field is invalid', () => {
    const sut = makeSut(5)
    const error = sut.validate('123')
    expect(error).toEqual(new InvalidFieldErro())
  })

  test('Should return falsy if field is not invalid', () => {
    const sut = makeSut(3)
    const error = sut.validate('123')
    expect(error).toBeFalsy()
  })
})
