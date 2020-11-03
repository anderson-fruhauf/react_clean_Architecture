import { HttpStatusCode } from '@/data/protocols/http/http-response'
import { Authentication, AuthenticationParams } from '../../../domain/usecases/autentication'
import { HttpPostClient } from '../../protocols/http/http-post-client'
import { InvalidCredentialsError } from '@/domain/errors/invalid-creintials-erros'
import { UnexpectedError } from './../../../domain/errors/unexpected-erros'
import { AccountModel } from '@/domain/models/accountModel'

export class RemoteAuthentication implements Authentication {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<AuthenticationParams, AccountModel>
  ) { }

  async auth(params: AuthenticationParams): Promise<AccountModel> {
    const httpResponse = await this.httpPostClient.post({
      url: this.url,
      body: params
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body
      case HttpStatusCode.unathorized: throw new InvalidCredentialsError()
      default: throw new UnexpectedError()
    }
  }
}
