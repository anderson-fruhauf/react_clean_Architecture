import React from 'react'
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import Login from './login'
import { ValidationSpy } from '@/presentation/test'
import faker, { fake } from 'faker'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

const makeSut = (validationError?: string): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMesage = validationError
  const sut = render(<Login validation={validationSpy} />)
  return {
    sut,
    validationSpy
  }
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
    const emailInput = sut.getByTestId('email')
    const email = faker.internet.email()
    fireEvent.input(emailInput, { target: { value: email } })
    expect(mockValidation.mock.calls[0]).toEqual(['email', email])
  })

  test('Should call password Validation with correct value', () => {
    const { sut, validationSpy } = makeSut()
    const mockValidation = jest.fn()
    validationSpy.validate = mockValidation
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: 'any_password' } })
    expect(mockValidation.mock.calls[1]).toEqual(['password', 'any_password'])
  })

  test('Should show email error if validation fails', () => {
    const { sut, validationSpy } = makeSut()
    const errorMessage = faker.random.words()
    validationSpy.errorMesage = errorMessage
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe(errorMessage)
    expect(emailStatus.textContent).toBe('⛔')
  })

  test('Should show password error if validation fails', () => {
    const { sut, validationSpy } = makeSut()
    const errorMessage = faker.random.words()
    validationSpy.errorMesage = errorMessage
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.random.word() } })
    const passwordStatus = sut.getByTestId('email-status')
    expect(passwordStatus.title).toBe(errorMessage)
    expect(passwordStatus.textContent).toBe('⛔')
  })

  test('Shold show valid email state if Validation success', () => {
    const { sut } = makeSut()
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe('Tudo certo!')
    expect(emailStatus.textContent).toBe('✔')
  })

  test('Shold show valid password state if Validation success', () => {
    const { sut } = makeSut()
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.random.word() } })
    const passwordStatus = sut.getByTestId('email-status')
    expect(passwordStatus.title).toBe('Tudo certo!')
    expect(passwordStatus.textContent).toBe('✔')
  })

  test('Shold enable submit  button if for is valid', () => {
    const { sut } = makeSut()
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.random.word() } })
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const sumbitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(sumbitButton.disabled).toBe(false)
  })

  test('Shold enable submit  button if for is valid', () => {
    const { sut } = makeSut()
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: faker.random.word() } })
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } })
    const sumbitButton = sut.getByTestId('submit') as HTMLButtonElement
    fireEvent.click(sumbitButton)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })
})
