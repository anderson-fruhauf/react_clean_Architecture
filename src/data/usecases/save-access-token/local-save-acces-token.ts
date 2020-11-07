import { SaveAccessToken } from '@/domain/usecases/save-access-token'
import { SetStorege } from '@/data/protocols/cache/set-storage'

export class LocalSaveAccessToken implements SaveAccessToken {
  constructor (private readonly setStorage: SetStorege) {}

  async save (accessToken: any): Promise<void> {
    await this.setStorage.set('accessToken', accessToken)
  }
}
