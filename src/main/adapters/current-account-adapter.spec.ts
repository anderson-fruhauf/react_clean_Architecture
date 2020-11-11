import { setCurrentAccountAdapter } from './current-account-adapter'
import { mockAccountModel } from '@/domain/test'
import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
import { UnexpectedError } from './../../domain/errors/unexpected-error'

jest.mock('@/infra/cache/local-storage-adapter')

describe('CurrentAccountAdapter', () => {
  test('Should call localStorageAdapter with correct values', () => {
    const account = mockAccountModel()
    const setSpy = jest.spyOn(LocalStorageAdapter.prototype, 'set')
    setCurrentAccountAdapter(account)
    expect(setSpy).toHaveBeenCalledWith('account', account)
  })

  test('Should throw UnexpectedError ', async () => {
    expect(setCurrentAccountAdapter).toThrow(new UnexpectedError())
  })
})
