import { AccountModel } from '@/domain/models'
export interface UpdateCurrentAccount {
  save: (accaunt: AccountModel) => Promise<void>
}
