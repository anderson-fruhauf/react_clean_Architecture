import { RemoteAuthentication } from '@/data/usecases/authentication/remote-autentication'
import { makeAxiosHttpClient } from '../../http/axios-http-client-factory'
import { makeApiUrl } from '@/main/factories/http/api-url-factory'

export const makeRemoAuthentication = (): RemoteAuthentication => {
  return new RemoteAuthentication(makeApiUrl('/login'), makeAxiosHttpClient())
}
