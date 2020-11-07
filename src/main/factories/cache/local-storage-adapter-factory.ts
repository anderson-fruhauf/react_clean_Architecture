import { LocalStorageAdapter } from '@/infra/cache/local-storage-adapter'
import { SetStorege } from '@/data/protocols/cache/set-storage'

export const makeLocalStorageAdapter = (): SetStorege => {
  return new LocalStorageAdapter()
}
