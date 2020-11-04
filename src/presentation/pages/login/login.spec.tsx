import React from 'react'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react'
import Login from './login'
import { ValidationSpy } from '@/presentation/test'
import faker, { fake } from 'faker'
import { Authentication, AuthenticationParams } from '@/domain/usecases'
import { AccountModel } from '@/domain/models'
import { mockAccountModel } from '@/domain/test'
import { InvalidCredentialsError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

class AuthenticationSpy implements Authentication {
  auth = jest.fn().mockResolvedValue(mockAccountModel())
}

const makeSut = (validationError?: string): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMesage = validationError
  const authenticationSpy = new AuthenticationSpy()
  const sut = render(<Login validation={validationSpy} authentication={authenticationSpy} />)
  return {
    sut,
    validationSpy,
    authenticationSpy
  }
}

const simulateValidSubmit = (sut: RenderResult, email = faker.internet.email(), password = faker.random.word()): { email: string, password: string } => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const sumbitButton = sut.getByTestId('submit') as HTMLButtonElement
  fireEvent.click(sumbitButton)
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
    const errorWrap = sut.getByTestId('error-wrap')
    const sumbitButton = sut.getByTestId('submit') as HTMLButtonElement
    const emailStatus = sut.getByTestId('email-status')
    const passwordStatus = sut.getByTestId('password-status')

    expect(errorWrap.childElementCount).toBe(0)
    expect(sumbitButton.disabled).toBe(true)
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

  test('Shold enable submit  button if for is valid', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    populatePasswordField(sut)
    const sumbitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(sumbitButton.disabled).toBe(false)
  })

  test('Shold enable submit  button if for is valid', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  test('Shold call authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()
    const params = simulateValidSubmit(sut)
    expect(authenticationSpy.auth).toHaveBeenCalledWith(params)
  })

  test('Shold call authentication only once', () => {
    const { sut, authenticationSpy } = makeSut()
    simulateValidSubmit(sut)
    simulateValidSubmit(sut)
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
    simulateValidSubmit(sut)
    const errorWrap = sut.getByTestId('error-wrap')
    await waitFor(() => errorWrap)
    const mainError = sut.getByTestId('main-error')
    expect(mainError.textContent).toBe(error.message)
    expect(errorWrap.childElementCount).toBe(1)
  })
})
