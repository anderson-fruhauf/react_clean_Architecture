import React from 'react'
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import Login from './login'
import { Validation } from '@/presentation/protocols/validation'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = render(<Login validation={validationSpy} />)
  return {
    sut,
    validationSpy
  }
}

class ValidationSpy implements Validation {
  errorMesage: string
  input: object
  validate(input: object): string {
    this.input = input
    return this.errorMesage
  }
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const { getByTestId } = makeSut().sut
    const errorWrap = getByTestId('error-wrap')
    const sumbitButton = getByTestId('submit') as HTMLButtonElement
    const emailStatus = getByTestId('email-status')
    const passwordStatus = getByTestId('password-status')

    expect(errorWrap.childElementCount).toBe(0)
    expect(sumbitButton.disabled).toBe(true)
    expect(emailStatus.title).toBe('Campo obrigatório')
    expect(passwordStatus.title).toBe('Campo obrigatório')
    expect(emailStatus.textContent).toBe('⛔')
    expect(passwordStatus.textContent).toBe('⛔')
  })

  test('Should call email Validation with correct value', () => {
    const { sut, validationSpy } = makeSut()
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: 'any_email' } })
    expect(validationSpy.input).toEqual({
      email: 'any_email'
    })
  })

  test('Should call password Validation with correct value', () => {
    const { sut, validationSpy } = makeSut()
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: 'any_password' } })
    expect(validationSpy.input).toEqual({
      password: 'any_password'
    })
  })
})
