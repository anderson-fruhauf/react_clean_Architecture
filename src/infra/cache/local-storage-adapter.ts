import { SetStorege } from '@/data/protocols/cache/set-storage'

export class LocalStorageAdapter implements SetStorege {
  async set (key: string, value: any): Promise<void> {
    localStorage.setItem(key, value)
  }
}
