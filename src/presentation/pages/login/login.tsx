import React, { useState } from 'react'
import Styles from './login-styles.scss'
import { Input, LoginHeader, FormStatus, Footer } from '@/presentation/components'
import Context from '@/presentation/context/form/form-context'

const Login: React.FC = () => {
  const [state] = useState({
    isLoading: false
  })

  const [errorState] = useState({
    email: 'Campo obrigatório',
    password: 'Campo obrigatório',
    main: ''
  })

  return (
    <div className={Styles.login}>
      <LoginHeader />
      <Context.Provider value={{ state, errorState }}>
        <form className={Styles.form}>
          <h2>Login</h2>
          <Input data-testid='email' type="email" name='email' placeholder='Digite seu e-mail' />
          <Input data-testid='password' type="password" name='password' placeholder='Digite seu e-mail' />
          <button data-testid='submit' disabled className={Styles.submit} type="submit">Entrar</button>
          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  )
}

export default Login
