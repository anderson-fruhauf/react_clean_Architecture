import React from 'react'
import { Login } from '@/presentation/pages'
import { makeRemoAuthentication } from '@/main/factories/usecases/authentication/remote-authenticatio-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLogin: React.FC = () => {
  return (
    <Login
      authentication={makeRemoAuthentication()}
      validation={makeLoginValidation()}
    />
  )
}
