import 'es6-promise/auto'
import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter,
  Switch,
  Route,
  RouteComponentProps
} from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import { Provider } from 'react-redux'

import { reducer, selectDashboard, selectDetails } from 'store'
import Dashboard from 'containers/DashboardContainer'
import Details from 'containers/DetailsContainer'
import Page404 from 'components/Page404'

const ViewDetails: React.FC<RouteComponentProps<{
  feedbackId: string
}>> = props => (
  <Details
    feedbackId={props.match.params.feedbackId}
    selector={selectDetails}
  />
)

const App: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact strict path="/">
        <Dashboard selector={selectDashboard} />
      </Route>

      <Route exact strict path="/details/:feedbackId" component={ViewDetails} />

      <Route component={Page404} />
    </Switch>
  </BrowserRouter>
)

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
