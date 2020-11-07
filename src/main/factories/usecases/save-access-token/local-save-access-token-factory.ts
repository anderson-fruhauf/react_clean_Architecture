import { makeLocalStorageAdapter } from '@/main/factories/cache/local-storage-adapter-factory'
import { SaveAccessToken } from '@/domain/usecases/save-access-token'
import { LocalSaveAccessToken } from '@/data/usecases/save-access-token/local-save-acces-token'

export const makeLocalSaveAccessToken = (): SaveAccessToken => {
  return new LocalSaveAccessToken(makeLocalStorageAdapter())
}
