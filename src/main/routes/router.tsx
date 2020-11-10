import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { SurveiList } from '@/presentation/pages'
import { makeLogin } from '../factories/pages/login/login-factory'
import { makeSignUp } from '../factories/pages/signup/signup-factory'

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={makeLogin} />
        <Route path="/signup" exact component={makeSignUp} />
        <Route path="/" exact component={SurveiList} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
