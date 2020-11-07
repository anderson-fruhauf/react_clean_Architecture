import faker from 'faker'
import { render, RenderResult, cleanup, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { createMemoryHistory } from 'history'
import {
  elementChildCount,
  buttonIsDisabled,
  populateField,
  ValidationSpy,
  populateAllField,
  SaveAccessTokenSpy
} from '@/presentation/test'
import { Router } from 'react-router-dom'
import Signup from './signup'
import { AddAccount, AddAccountParams } from '@/domain/usecases'
import { mockAccountModel, mockAddAccountParams } from '@/domain/test'
import { EmailInUseError } from '@/domain/errors'

const history = createMemoryHistory({ initialEntries: ['/login'] })

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  addAccountSpy: AddAccountSpy
  saveAccessToken: SaveAccessTokenSpy
}

class AddAccountSpy implements AddAccount {
  account = mockAccountModel()
  add = jest.fn().mockResolvedValue(this.account)
}

const makeSut = (validationError?: string): SutTypes => {
  const validationSpy = new ValidationSpy()
  validationSpy.errorMesage = validationError
  const addAccountSpy = new AddAccountSpy()
  const saveAccessToken = new SaveAccessTokenSpy()
  const sut = render(
    <Router history={history}>
      <Signup validation={validationSpy} addAccount={addAccountSpy} saveAccessToken={saveAccessToken} />
    </Router>
  )
  return {
    sut,
    validationSpy,
    addAccountSpy,
    saveAccessToken
  }
}

const simulateValidSubmit = async (
  sut: RenderResult,
  params: AddAccountParams = mockAddAccountParams()
): Promise<void> => {
  populateField(sut, 'name', params.name)
  populateField(sut, 'email', params.email)
  populateField(sut, 'password', params.password)
  populateField(sut, 'passwordConfirmation', params.passwordConfirmation)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('Signup Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = 'Campo obrigatório'
    const { sut } = makeSut(validationError)
    const nameStatus = sut.getByTestId('name-status')
    const emailStatus = sut.getByTestId('email-status')
    const passwordStatus = sut.getByTestId('password-status')
    const passwordConfirmationStatus = sut.getByTestId('passwordConfirmation-status')

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

  test('Shold enable submit  button if for is valid', async () => {
    const { sut } = makeSut()
    populateAllField(sut, ['name', 'email', 'password', 'passwordConfirmation'])
    expect(buttonIsDisabled(sut, 'submit')).toBeFalsy()
  })

  test('Shold present spinner on form submit', async () => {
    const { sut } = makeSut()
    populateAllField(sut, ['name', 'email', 'password', 'passwordConfirmation'])
    const form = sut.getByTestId('form')
    fireEvent.submit(form)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  test('Shold call authentication with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const params = mockAddAccountParams()
    await simulateValidSubmit(sut, params)
    expect(addAccountSpy.add).toHaveBeenCalledWith(params)
  })

  test('Shold call authentication only once', async () => {
    const { sut, addAccountSpy } = makeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(addAccountSpy.add).toHaveBeenCalledTimes(1)
  })

  test('Shold not call submit if form is invalid', () => {
    const validationError = faker.random.word()
    const { sut, addAccountSpy } = makeSut(validationError)
    fireEvent.submit(sut.getByTestId('form'))
    expect(addAccountSpy.add).not.toHaveBeenCalled()
  })

  test('Should present error if AddAccounts fails', async () => {
    const { sut, addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    addAccountSpy.add.mockRejectedValueOnce(error)
    await simulateValidSubmit(sut)
    const mainError = sut.getByTestId('main-error')
    expect(mainError.textContent).toBe(error.message)
    expect(elementChildCount(sut, 'error-wrap')).toBe(1)
  })

  test('Should call SaveAccessToken on success', async () => {
    const { sut, addAccountSpy, saveAccessToken } = makeSut()
    await simulateValidSubmit(sut)
    expect(saveAccessToken.save).toHaveBeenCalledWith(addAccountSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })
})
