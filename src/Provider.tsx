import React from 'react'
import { Program, Worker, Cmd, Sub } from 'frctl'

export type Dispatch<Msg> = (msg: Msg) => void

export type Props<Model, Msg> = {
  view: React.ComponentType<{
    model: Model
    dispatch: Dispatch<Msg>
  }>
  init: [Model, Cmd<Msg>]
  update(msg: Msg, model: Model): [Model, Cmd<Msg>]
  subscription(model: Model): Sub<Msg>
}

export default class Provider<Model, Msg> extends React.PureComponent<
  Props<Model, Msg>,
  Model
> {
  private readonly worker: Worker<Model, Msg>
  private readonly dispatch: Dispatch<Msg>
  private unsubscribe = (): void => {
    /* noop */
  }

  protected constructor(props: Props<Model, Msg>) {
    super(props)

    this.worker = Program.worker({
      init: () => props.init,
      update: props.update,
      subscriptions: props.subscription
    }).init(null)

    this.dispatch = msg => this.worker.dispatch(msg)

    this.state = this.worker.getModel()
  }

  public componentDidMount(): void {
    this.unsubscribe = this.worker.subscribe(() => {
      this.setState(this.worker.getModel())
    })
  }

  public componentWillUnmount(): void {
    this.unsubscribe()
  }

  public render(): JSX.Element {
    const View = this.props.view

    return <View model={this.state} dispatch={this.dispatch} />
  }
}
