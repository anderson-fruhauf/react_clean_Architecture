import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Styles from './signup-styles.scss'
import { Input, LoginHeader, FormStatus, Footer } from '@/presentation/components'
import Context from '@/presentation/context/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication, SaveAccessToken } from '@/domain/usecases'

const Signup: React.FC = () => {
  const [state] = useState({
    isLoading: false,
    nameError: 'Campo obrigatório',
    emailError: 'Campo obrigatório',
    passwordError: 'Campo obrigatório',
    passwordConfirmationError: 'Campo obrigatório',
    mainError: ''
  })

  return (
    <div className={Styles.signup}>
      <LoginHeader />
      <Context.Provider value={{ state: state }}>
        <form data-testid='form' className={Styles.form} >
          <h2>Cadastrar Conta</h2>
          <Input type="text" name='name' placeholder='Digite seu nome' />
          <Input data-testid='email' type="email" name='email' placeholder='Digite seu e-mail' />
          <Input data-testid='password' type="password" name='password' placeholder='Digite sua senha' />
          <Input type="password" name='passwordConfirmation' placeholder='Repita sua senha' />
          <button data-testid='submit' disabled className={Styles.submit} type="submit">Entrar</button>
          <Link data-testid='signup' to='/login' className={Styles.link}>Voltar Para Login</Link>
          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  )
}

export default Signup
