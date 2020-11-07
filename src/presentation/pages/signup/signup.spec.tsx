import faker from 'faker'
import { render, RenderResult, cleanup } from '@testing-library/react'
import React from 'react'
import { createMemoryHistory } from 'history'
import {
  elementChildCount,
  buttonIsDisabled,
  populateField,
  ValidationSpy
} from '@/presentation/test'
import { Router } from 'react-router-dom'
import Signup from './signup'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (validationError?: string): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMesage = validationError
  const sut = render(
    <Router history={history}>
      <Signup validation={validationSpy} />
    </Router>
  )
  return {
    sut,
    validationSpy
  }
}

describe('Signup Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = 'Campo obrigatório'
    const { sut } = makeSut(validationError)
    const nameStatus = sut.getByTestId('name-status')
    const emailStatus = sut.getByTestId('email-status')
    const passwordStatus = sut.getByTestId('password-status')
    const passwordConfirmationStatus = sut.getByTestId(
      'passwordConfirmation-status'
    )

    expect(elementChildCount(sut, 'error-wrap')).toBe(0)
    expect(buttonIsDisabled(sut, 'submit')).toBe(true)
    expect(nameStatus.title).toBe(validationError)
    expect(nameStatus.textContent).toBe('⛔')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('⛔')
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('⛔')
    expect(passwordConfirmationStatus.title).toBe(validationError)
    expect(passwordConfirmationStatus.textContent).toBe('⛔')
  })

  test('Should show name error if validation fails', () => {
    const errorMessage = faker.random.words(4)
    const { sut, validationSpy } = makeSut(errorMessage)
    populateField(sut, 'name')
    const emailStatus = sut.getByTestId('name-status')
    expect(emailStatus.title).toBe(errorMessage)
    expect(emailStatus.textContent).toBe('⛔')
  })

  test('Should show email error if validation fails', () => {
    const { sut, validationSpy } = makeSut()
    const errorMessage = faker.random.words()
    validationSpy.errorMesage = errorMessage
    populateField(sut, 'email')
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe(errorMessage)
    expect(emailStatus.textContent).toBe('⛔')
  })

  test('Should show password error if validation fails', () => {
    const { sut, validationSpy } = makeSut()
    const errorMessage = faker.random.words()
    validationSpy.errorMesage = errorMessage
    populateField(sut, 'password')
    const emailStatus = sut.getByTestId('password-status')
    expect(emailStatus.title).toBe(errorMessage)
    expect(emailStatus.textContent).toBe('⛔')
  })

  test('Should show passwordConfirmation error if validation fails', () => {
    const { sut, validationSpy } = makeSut()
    const errorMessage = faker.random.words()
    validationSpy.errorMesage = errorMessage
    populateField(sut, 'passwordConfirmation')
    const emailStatus = sut.getByTestId('passwordConfirmation-status')
    expect(emailStatus.title).toBe(errorMessage)
    expect(emailStatus.textContent).toBe('⛔')
  })

  test('Shold show valid name state if Validation success', () => {
    const { sut } = makeSut()
    populateField(sut, 'name')
    const emailStatus = sut.getByTestId('name-status')
    expect(emailStatus.title).toBe('Tudo certo!')
    expect(emailStatus.textContent).toBe('✔')
  })

  test('Shold show valid email state if Validation success', () => {
    const { sut } = makeSut()
    populateField(sut, 'email')
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe('Tudo certo!')
    expect(emailStatus.textContent).toBe('✔')
  })

  test('Shold show valid password state if Validation success', () => {
    const { sut } = makeSut()
    populateField(sut, 'password')
    const emailStatus = sut.getByTestId('password-status')
    expect(emailStatus.title).toBe('Tudo certo!')
    expect(emailStatus.textContent).toBe('✔')
  })

  test('Shold show valid passwordConfirmation state if Validation success', () => {
    const { sut } = makeSut()
    populateField(sut, 'passwordConfirmation')
    const emailStatus = sut.getByTestId('passwordConfirmation-status')
    expect(emailStatus.title).toBe('Tudo certo!')
    expect(emailStatus.textContent).toBe('✔')
  })
})
