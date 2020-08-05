import React, { FC, PropsWithChildren, NamedExoticComponent } from 'react'
import { Program, Worker, Cmd, Sub } from 'frctl'
import { shallowEqual } from 'shallow-equal-object'

export type Dispatch<Msg> = (msg: Msg) => void

type Memo = <Msg, P extends { dispatch: Dispatch<Msg> }>(
  Component: FC<P>,
  propsAreEqual?: (
    prevProps: Readonly<PropsWithChildren<Omit<P, 'dispatch'>>>,
    nextProps: Readonly<PropsWithChildren<Omit<P, 'dispatch'>>>
  ) => boolean
) => NamedExoticComponent<P>

export const memoWithDispatch: Memo = (Component, propsAreEqual) =>
  React.memo(
    Component,
    ({ dispatch: _, ...prev }, { dispatch: __, ...next }) => {
      if (typeof propsAreEqual === 'undefined') {
        return shallowEqual(prev, next)
      }

      return propsAreEqual(prev, next)
    }
  )

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
