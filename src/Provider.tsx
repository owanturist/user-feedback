import React from 'react'
import { Program, Cmd, Sub, Task } from 'frctl'
import { Cata, cons } from 'frctl/Basics'
import { Url } from 'frctl/Url'
import Maybe from 'frctl/Maybe'
import { createBrowserHistory } from 'history'

import type { Navigation } from 'Router'

export type Dispatch<Msg> = (msg: Msg) => void

export type UrlRequestPattern<R> = Cata<{
  Internal(url: Url): R
  External(url: string): R
}>

export type UrlRequest = {
  cata<R>(pattern: UrlRequestPattern<R>): R
}

export type Props<Model, Msg> = {
  view: React.ComponentType<{
    model: Model
    dispatch: Dispatch<Msg>
  }>
  init(initialUrl: Url, navigation: Navigation): [Model, Cmd<Msg>]
  update(msg: Msg, model: Model): [Model, Cmd<Msg>]
  subscriptions(model: Model): Sub<Msg>
  onUrlRequest(request: UrlRequest): Msg
  onUrlChange(url: Url): Msg
}

export const Provider = React.memo(
  <Model, Msg>({
    view: View,
    init,
    update,
    subscriptions,
    onUrlRequest,
    onUrlChange
  }: Props<Model, Msg>) => {
    const [state, setState] = React.useState<{
      model: null | Model
      dispatch: Dispatch<Msg>
    }>({
      model: null,
      dispatch: () => {
        /* noop */
      }
    })

    React.useEffect(() => {
      const dispatch: Dispatch<Msg> = msg => worker.dispatch(msg)
      const onUrlChangeHandler = (): void => dispatch(onUrlChange(getURL()))
      const navigation = new NavigationImpl(onUrlChangeHandler)

      const worker = Program.worker({
        init: () => init(getURL(), navigation),
        update,
        subscriptions
      }).init(null)

      const unsubscribe = worker.subscribe(() =>
        setState({
          model: worker.getModel(),
          dispatch
        })
      )

      setState({
        model: worker.getModel(),
        dispatch
      })

      if (window.navigator.userAgent.indexOf('Trident') < 0) {
        window.addEventListener('hashchange', onUrlChangeHandler)
      }

      window.addEventListener('popstate', onUrlChangeHandler)

      return () => {
        if (window.navigator.userAgent.indexOf('Trident') < 0) {
          window.removeEventListener('hashchange', onUrlChangeHandler)
        }

        window.removeEventListener('popstate', onUrlChangeHandler)

        unsubscribe()
      }
    }, [update, subscriptions, init, onUrlChange])

    const { model, dispatch } = state

    const onChangeUrl = React.useCallback(
      (href: string): void => {
        dispatch(onUrlRequest(hrefToUrlRequest(getURL(), href)))
      },
      [dispatch, onUrlRequest]
    )

    return (
      <NavigationContext.Provider value={onChangeUrl}>
        {model && <View model={model} dispatch={dispatch} />}
      </NavigationContext.Provider>
    )
  }
)

export default Provider

// N A V I G A T I O N

const Internal = cons<[Url], UrlRequest>(
  class Internal implements UrlRequest {
    public constructor(private readonly url: Url) {}

    public cata<R>(pattern: UrlRequestPattern<R>): R {
      return typeof pattern.Internal === 'function'
        ? pattern.Internal(this.url)
        : (pattern._ as () => R)()
    }
  }
)

const External = cons<[string], UrlRequest>(
  class External implements UrlRequest {
    public constructor(private readonly url: string) {}

    public cata<R>(pattern: UrlRequestPattern<R>): R {
      return typeof pattern.External === 'function'
        ? pattern.External(this.url)
        : (pattern._ as () => R)()
    }
  }
)

const isInternalUrl = (currentUrl: Url, nextUrl: Url): boolean => {
  return (
    currentUrl.protocol.isEqual(nextUrl.protocol) &&
    currentUrl.host === nextUrl.host &&
    currentUrl.port.isEqual(nextUrl.port)
  )
}

const hrefToUrlRequest = (currentUrl: Url, href: string): UrlRequest => {
  return Url.fromString(href)
    .chain(url =>
      isInternalUrl(currentUrl, url) ? Maybe.Just(url) : Maybe.Nothing
    )
    .map(Internal)
    .getOrElse(External(href))
}

const history = createBrowserHistory()

const fakeURL = Url.cons(Url.Http, '')

const getURL = (): Url => {
  return Url.fromString(document.location.href || '').getOrElse(fakeURL)
}

class NavigationImpl implements Navigation {
  public constructor(private readonly onChange: () => void) {}

  public replace(href: string): Cmd<never> {
    return Task.binding(() => {
      history.replace(href)
      this.onChange()
    }).perform(null as never)
  }

  public push(href: string): Cmd<never> {
    return Task.binding(() => {
      history.push(href)
      this.onChange()
    }).perform(null as never)
  }

  public back(steps: number): Cmd<never> {
    return steps > 0 ? this.go(-steps) : Cmd.none
  }

  public forward(steps: number): Cmd<never> {
    return steps > 0 ? this.go(steps) : Cmd.none
  }

  private go(steps: number): Cmd<never> {
    return Task.binding(() => {
      if (steps !== 0) {
        history.go(steps)
        this.onChange()
      }
    }).perform(null as never)
  }

  // eslint-disable-next-line class-methods-use-this
  public load(href: string): Cmd<never> {
    return Task.binding(() => {
      window.location.replace(href)
    }).perform(null as never)
  }
}

const NavigationContext = React.createContext((_href: string): void => {
  /* empy */
})

export const NavigationConsumer = NavigationContext.Consumer
