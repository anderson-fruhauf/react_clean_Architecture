import { getCurrentAccountAdapter, setCurrentAccountAdapter } from './current-account-adapter'
import { mockAccountModel } from '@/domain/test'
import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
import { UnexpectedError } from './../../domain/errors/unexpected-error'

jest.mock('@/infra/cache/local-storage-adapter')

describe('CurrentAccountAdapter', () => {
  test('Should call localStorageAdapter.set with correct values', () => {
    const account = mockAccountModel()
    const setSpy = jest.spyOn(LocalStorageAdapter.prototype, 'set')
    setCurrentAccountAdapter(account)
    expect(setSpy).toHaveBeenCalledWith('account', account)
  })

  test('Should throw UnexpectedError ', async () => {
    expect(setCurrentAccountAdapter).toThrow(new UnexpectedError())
  })

  test('Should call localStorageAdapter.get with correct values', () => {
    const account = mockAccountModel()
    const getSpy = jest.spyOn(LocalStorageAdapter.prototype, 'get').mockReturnValue(account)
    const response = getCurrentAccountAdapter()
    expect(response).toEqual(account)
  })
})
