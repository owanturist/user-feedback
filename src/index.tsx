import 'es6-promise/auto'
import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'

import { toDashboard } from 'Router'
import { State, reducer } from 'store'
import Dashboard from 'containers/DashboardContainer'

const App: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path={toDashboard}>
        <Dashboard selector={(state: State) => state.dashboard} />
      </Route>
    </Switch>
  </BrowserRouter>
)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStore(reducer, applyMiddleware(thunkMiddleware))}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
