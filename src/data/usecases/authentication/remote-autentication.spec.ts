import { HttpPostClientSpy } from '@/data/test/mock-http-client'
import { RemoteAuthentication } from './remote-autentication'
import { mockAccountModel, mockAuthentication } from '@/domain/test/mock-account'
import { InvalidCredentialsError } from '@/domain/errors/invalid-creintials-erros'
import faker from 'faker'
import { HttpStatusCode } from '@/data/protocols/http/http-response'
import { UnexpectedError } from './../../../domain/errors/unexpected-erros'
import { AuthenticationParams } from '@/domain/usecases/autentication'
import { AccountModel } from '@/domain/models/accountModel'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy<AuthenticationParams, AccountModel>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AuthenticationParams, AccountModel>()
  const sut = new RemoteAuthentication(url, httpPostClientSpy)
  return { sut, httpPostClientSpy }
}

describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with correct Url', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    await sut.auth(mockAuthentication())
    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should call HttpPostClient with correct body', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const authenticationParams = mockAuthentication()
    await sut.auth(authenticationParams)
    expect(httpPostClientSpy.body).toEqual(authenticationParams)
  })

  test('Should throw InvalidCredentialsError if HttpPostClient return 401', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unathorized
    }
    const promisse = sut.auth(mockAuthentication())
    await expect(promisse).rejects.toThrow(new InvalidCredentialsError())
  })

  test('Should throw UnexpectedError if HttpPostClient return 400', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promisse = sut.auth(mockAuthentication())
    await expect(promisse).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpPostClient return 500', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promisse = sut.auth(mockAuthentication())
    await expect(promisse).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError if HttpPostClient return 404', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promisse = sut.auth(mockAuthentication())
    await expect(promisse).rejects.toThrow(new UnexpectedError())
  })

  test('Should return a AccountModel if HttpPostClient return 200', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const httpResult = mockAccountModel()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const acount = await sut.auth(mockAuthentication())
    await expect(acount).toEqual(httpResult)
  })
})
