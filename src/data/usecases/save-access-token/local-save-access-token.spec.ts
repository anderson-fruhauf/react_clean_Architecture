import { LocalSaveAccessToken } from './local-save-acces-token'
import { SetStorageSpy } from '@/data/test'
import faker from 'faker'

type SutTypes = {
  sut: LocalSaveAccessToken
  setStorageSpy: SetStorageSpy
}

const makeSut = (): SutTypes => {
  const setStorageSpy = new SetStorageSpy()
  const sut = new LocalSaveAccessToken(setStorageSpy)
  return { sut, setStorageSpy }
}

describe('LocalSaveAccessToken', () => {
  test('Should call setStorege with correct value', async () => {
    const { sut, setStorageSpy } = makeSut()
    const accessToken = faker.random.uuid()
    await sut.save(accessToken)
    expect(setStorageSpy.set).toHaveBeenCalled()
    expect(setStorageSpy.set).toHaveBeenCalledWith('accessToken', accessToken)
  })
})
