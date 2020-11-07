import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import faker from 'faker'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import Login from './login'
import { buttonIsDisabled, elementChildCount, ValidationSpy } from '@/presentation/test'
import { Authentication } from '@/domain/usecases'
import { mockAccountModel } from '@/domain/test'
import { InvalidCredentialsError } from '@/domain/errors'
import { SaveAccessToken } from '@/domain/usecases/save-access-token'
import { SaveAccessTokenSpy } from '@/presentation/test/save-access-token-spy'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
  saveAccessToken: SaveAccessTokenSpy
}

class AuthenticationSpy implements Authentication {
  account = mockAccountModel()
  auth = jest.fn().mockResolvedValue(this.account)
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (validationError?: string): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMesage = validationError
  const authenticationSpy = new AuthenticationSpy()
  const saveAccessToken = new SaveAccessTokenSpy()
  const sut = render(
    <Router history={history}>
      <Login validation={validationSpy} authentication={authenticationSpy} saveAccessToken={saveAccessToken} />
    </Router>
  )
  return {
    sut,
    validationSpy,
    authenticationSpy,
    saveAccessToken
  }
}

const simulateValidSubmit = async (
  sut: RenderResult,
  email = faker.internet.email(),
  password = faker.random.word()
): Promise<{ email: string, password: string }> => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
  return { email, password }
}

const populateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (sut: RenderResult, password = faker.random.word()): void => {
  const emailInput = sut.getByTestId('password')
  fireEvent.input(emailInput, { target: { value: password } })
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = faker.random.word()
    const { sut, validationSpy } = makeSut(validationError)
    const emailStatus = sut.getByTestId('email-status')
    const passwordStatus = sut.getByTestId('password-status')

    expect(elementChildCount(sut, 'error-wrap')).toBe(0)
    expect(buttonIsDisabled(sut, 'submit')).toBe(true)
    expect(emailStatus.title).toBe(validationSpy.errorMesage)
    expect(passwordStatus.title).toBe(validationSpy.errorMesage)
    expect(emailStatus.textContent).toBe('⛔')
    expect(passwordStatus.textContent).toBe('⛔')
  })

  test('Should call email Validation with correct value', () => {
    const { sut, validationSpy } = makeSut()
    const mockValidation = jest.fn()
    validationSpy.validate = mockValidation
    const email = faker.internet.email()
    populateEmailField(sut, email)
    expect(mockValidation.mock.calls[0]).toEqual(['email', email])
  })

  test('Should call password Validation with correct value', () => {
    const { sut, validationSpy } = makeSut()
    const mockValidation = jest.fn()
    validationSpy.validate = mockValidation
    populatePasswordField(sut, 'any_password')
    expect(mockValidation.mock.calls[1]).toEqual(['password', 'any_password'])
  })

  test('Should show email error if validation fails', () => {
    const { sut, validationSpy } = makeSut()
    const errorMessage = faker.random.words()
    validationSpy.errorMesage = errorMessage
    populateEmailField(sut)
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe(errorMessage)
    expect(emailStatus.textContent).toBe('⛔')
  })

  test('Should show password error if validation fails', () => {
    const { sut, validationSpy } = makeSut()
    const errorMessage = faker.random.words()
    validationSpy.errorMesage = errorMessage
    populatePasswordField(sut)
    const passwordStatus = sut.getByTestId('email-status')
    expect(passwordStatus.title).toBe(errorMessage)
    expect(passwordStatus.textContent).toBe('⛔')
  })

  test('Shold show valid email state if Validation success', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe('Tudo certo!')
    expect(emailStatus.textContent).toBe('✔')
  })

  test('Shold show valid password state if Validation success', () => {
    const { sut } = makeSut()
    populatePasswordField(sut)
    const passwordStatus = sut.getByTestId('email-status')
    expect(passwordStatus.title).toBe('Tudo certo!')
    expect(passwordStatus.textContent).toBe('✔')
  })

  test('Shold enable submit  button if for is valid', async () => {
    const { sut } = makeSut()
    await simulateValidSubmit(sut)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  test('Shold call authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const params = await simulateValidSubmit(sut)
    expect(authenticationSpy.auth).toHaveBeenCalledWith(params)
  })

  test('Shold call authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(authenticationSpy.auth).toHaveBeenCalledTimes(1)
  })

  test('Shold not call submit if form is invalid', () => {
    const validationError = faker.random.word()
    const { sut, authenticationSpy } = makeSut(validationError)
    populateEmailField(sut)
    fireEvent.submit(sut.getByTestId('form'))
    expect(authenticationSpy.auth).not.toHaveBeenCalled()
  })

  test('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    authenticationSpy.auth.mockRejectedValueOnce(error)
    await simulateValidSubmit(sut)
    const errorWrap = sut.getByTestId('error-wrap')
    const mainError = sut.getByTestId('main-error')
    expect(mainError.textContent).toBe(error.message)
    expect(errorWrap.childElementCount).toBe(1)
  })

  test('Should call SaveAccessToken on success', async () => {
    const { sut, authenticationSpy, saveAccessToken } = makeSut()
    await simulateValidSubmit(sut)
    expect(saveAccessToken.save).toHaveBeenCalledWith(authenticationSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('Shold go to singUp page', () => {
    const { sut } = makeSut()
    const register = sut.getByTestId('signup')
    fireEvent.click(register)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/singup')
  })
})
