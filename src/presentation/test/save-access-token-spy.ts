import { SaveAccessToken } from '@/domain/usecases/save-access-token'

export class SaveAccessTokenSpy implements SaveAccessToken {
  save = jest.fn()
}
