import React from 'react'
import { Program, Cmd, Sub } from 'frctl'

export type Dispatch<Msg> = (msg: Msg) => void

export type Props<Model, Msg> = {
  view: React.ComponentType<{
    model: Model
    dispatch: Dispatch<Msg>
  }>
  init: [Model, Cmd<Msg>]
  update(msg: Msg, model: Model): [Model, Cmd<Msg>]
  subscriptions(model: Model): Sub<Msg>
}

export const Provider = React.memo(
  <Model, Msg>({
    init,
    update,
    subscriptions,
    view: View
  }: Props<Model, Msg>) => {
    const [state, setState] = React.useState<null | [Model, Dispatch<Msg>]>(
      null
    )

    React.useEffect(() => {
      const worker = Program.worker({
        init: () => init,
        update,
        subscriptions
      }).init(null)

      const dispatch: Dispatch<Msg> = msg => worker.dispatch(msg)

      setState([worker.getModel(), dispatch])

      const unsubscribe = worker.subscribe(() =>
        setState([worker.getModel(), dispatch])
      )

      return () => unsubscribe()
    }, [update, subscriptions, init])

    if (state === null) {
      return null
    }

    return <View model={state[0]} dispatch={state[1]} />
  }
)

export default Provider
