import { AccountModel } from '../models/accountModel'

export type AddAccountParams = {
  email: string
  password: string
  passwordConfirmation: string
  name: string
}

export interface AddAccount {
  auth: (params: AddAccountParams) => Promise<AccountModel>
}
