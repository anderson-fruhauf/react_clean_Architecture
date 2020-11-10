import { RemoteLoadSurveyList } from './remote-load-survey-list'
import { HttpGetClientSpy } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { UnexpectedError } from '@/domain/errors'
import { SurveyModel } from '@/domain/models'
import faker from 'faker'
import { EmailInUseError } from './../../../domain/errors/email-in-use-error'
import { mockSurveyList } from '@/domain/test'

type SutTypes = {
  sut: RemoteLoadSurveyList
  httpGetClientSpy: HttpGetClientSpy<SurveyModel[]>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy()
  httpGetClientSpy.get.mockResolvedValue({ statusCode: HttpStatusCode.ok })
  const sut = new RemoteLoadSurveyList(url, httpGetClientSpy)
  return { sut, httpGetClientSpy }
}

describe('RemoteLoadSurveyList', () => {
  test('Should call HttpGetClient with correct url', async () => {
    const url: string = faker.internet.url()
    const { sut, httpGetClientSpy } = makeSut(url)
    await sut.loadAll()
    expect(httpGetClientSpy.get).toHaveBeenCalledWith({ url })
  })

  test('Should throw UnexpecedError if HttpClient returns 403', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.get.mockResolvedValue({
      statusCode: HttpStatusCode.forbidden
    })
    expect(sut.loadAll()).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpecedError if HttpClient returns 404', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.get.mockResolvedValue({
      statusCode: HttpStatusCode.notFound
    })
    expect(sut.loadAll()).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpecedError if HttpClient returns 500', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.get.mockResolvedValue({
      statusCode: HttpStatusCode.serverError
    })
    const promisse = sut.loadAll()
    expect(promisse).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpecedError if HttpClient returns 500', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.get.mockResolvedValue({
      statusCode: HttpStatusCode.serverError
    })
    const promisse = sut.loadAll()
    expect(promisse).rejects.toThrow(new UnexpectedError())
  })

  test('Should return a list of SurveyModels if HttpClient returns 200', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    const httpResult = mockSurveyList(1)
    httpGetClientSpy.get.mockResolvedValue({
      statusCode: HttpStatusCode.ok,
      body: httpResult
    })
    const resolvedList = await sut.loadAll()
    expect(resolvedList).toEqual(httpResult)
  })

  test('Should return empty list if HttpClient returns 204', async () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.get.mockResolvedValue({
      statusCode: HttpStatusCode.noContent
    })
    const resolvedList = await sut.loadAll()
    expect(resolvedList).toEqual([])
  })
})
