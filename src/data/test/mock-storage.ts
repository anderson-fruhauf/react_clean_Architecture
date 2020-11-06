import { SetStorege } from '../protocols/cache/set-storage'

export class SetStorageSpy implements SetStorege {
  set = jest.fn()
}
