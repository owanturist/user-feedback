import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'

import { Cmd, Sub } from 'frctl'
import Provider from 'Provider'
import * as App from './App'

const init: [App.Model, Cmd<App.Msg>] = [App.initial, Cmd.none]

const update = (msg: App.Msg, model: App.Model): [App.Model, Cmd<App.Msg>] => {
  return [msg.update(model), Cmd.none]
}

const subscription = (): Sub<App.Msg> => Sub.none

ReactDOM.render(
  <React.StrictMode>
    <Provider
      init={init}
      update={update}
      view={App.View}
      subscription={subscription}
    />
  </React.StrictMode>,
  document.getElementById('root')
)
