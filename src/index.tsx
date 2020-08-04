import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'

import { Cmd, Sub } from 'frctl'
import Provider from 'Provider'
import * as App from './App'

const update = (msg: App.Msg, model: App.Model): [App.Model, Cmd<App.Msg>] => {
  return [msg.update(model), Cmd.none]
}

ReactDOM.render(
  <React.StrictMode>
    <Provider
      init={[App.initial, Cmd.none]}
      update={update}
      view={App.View}
      subscription={() => Sub.none}
    />
  </React.StrictMode>,
  document.getElementById('root')
)
