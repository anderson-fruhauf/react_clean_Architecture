export enum HttpStatusCode {
  serverError = 500,
  notFound = 404,
  forbiden = 403,
  unauthorized = 401,
  badRequest = 400,
  noContent = 204,
  ok = 200
}

export type HttpResponse<T> = {
  statusCode: HttpStatusCode
  body?: T
}
