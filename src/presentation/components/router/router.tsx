import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import SurveiList from './../../pages/survey-list/survei-list'

type Factory = {
  makeLogin: React.FC
  makeSignUp: React.FC
}

const Router: React.FC<Factory> = (factory: Factory) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={factory.makeLogin} />
        <Route path="/signup" exact component={factory.makeSignUp} />
        <Route path="/" exact component={SurveiList} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
