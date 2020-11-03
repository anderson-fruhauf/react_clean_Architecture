import { AuthenticationParams } from '../usecases/autentication'
import faker from 'faker'
import { AccountModel } from '../models/accountModel'
import { access } from 'fs'

export const mockAuthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAccountModel = (): AccountModel => ({
  accessToken: faker.random.uuid()
})
