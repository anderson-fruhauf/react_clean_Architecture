import faker from 'faker'
import 'jest-localstorage-mock'
import { LocalStorageAdapter } from './local-storage-adapter'
import { AccountModel } from '@/domain/models'

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter()

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('Should call localStorage.setItem with correct values', () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value = faker.random.objectElement<AccountModel>()
    sut.set(key, value)
    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value))
  })

  test('Should call localStorage.getItem with correct value', () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value = faker.random.objectElement<AccountModel>()
    jest.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(value))
    const obj = sut.get(key)
    expect(localStorage.getItem).toHaveBeenCalledWith(key)
    expect(obj).toEqual(value)
  })
})
