import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { SurveiList } from '@/presentation/pages'
import { makeLogin } from '../factories/pages/login/login-factory'
import { makeSignUp } from '../factories/pages/signup/signup-factory'
import { ApiContext } from '@/presentation/contexts'
import {
  getCurrentAccountAdapter,
  setCurrentAccountAdapter
} from './../adapters/current-account-adapter'
import PrivateRoute from '@/presentation/components/private-route/private-route'

const Router: React.FC = () => {
  return (
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountAdapter,
        getCurrentAccount: getCurrentAccountAdapter
      }}
    >
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact component={makeLogin} />
          <Route path="/signup" exact component={makeSignUp} />
          <PrivateRoute path="/" exact component={SurveiList} />
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

export default Router
