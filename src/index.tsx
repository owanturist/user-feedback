import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'

import { Cmd, Sub } from 'frctl'
import Provider from 'Provider'
import * as App from './App'

// const init: [App.Model, Cmd<App.Msg>] = App.init

const update = (msg: App.Msg, model: App.Model): [App.Model, Cmd<App.Msg>] =>
  msg.update(model)

const subscriptions = (): Sub<App.Msg> => Sub.none

ReactDOM.render(
  <React.StrictMode>
    <Provider
      init={App.init}
      update={update}
      subscriptions={subscriptions}
      onUrlRequest={App.onUrlRequest}
      onUrlChange={App.onUrlChange}
      view={App.View}
    />
  </React.StrictMode>,
  document.getElementById('root')
)
