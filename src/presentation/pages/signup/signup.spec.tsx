import faker from 'faker'
import { render, RenderResult } from '@testing-library/react'
import React from 'react'
import { createMemoryHistory } from 'history'
import { elementChildCount, buttonIsDisabled } from '@/presentation/test'
import { Router } from 'react-router-dom'
import Signup from './signup'

type SutTypes = {
  sut: RenderResult
}

const history = createMemoryHistory({ initialEntries: ['/login'] })

const makeSut = (validationError?: string): SutTypes => {
  const sut = render(
    <Router history={history}>
      <Signup/>
    </Router>
  )
  return {
    sut
  }
}

describe('Signup Component', () => {
  test('Should start with initial state', () => {
    const validationError = 'Campo obrigatório'
    const { sut } = makeSut()
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
})
