import React, { FC } from 'react'
import { Cmd } from 'frctl'
import { Cata, cons } from 'frctl/Basics'
import { Url } from 'frctl/Url'

import { Dispatch, UrlRequest } from 'Provider'
import * as Router from 'Router'
import * as Dashboard from 'Dashboard'
import * as Counter from 'Counter'
import * as utils from 'utils'

// S C R E E N

type ScreenPattern<R> = Cata<{
  DashboardScreen(dashboard: Dashboard.Model): R
  FeedbackScreen(feedbackId: string, counter: Counter.Model): R
  NotFoundScreen(): R
}>

type Screen = {
  cata<R>(pattern: ScreenPattern<R>): R
}

export const DashboardScreen = cons<[Dashboard.Model], Screen>(
  class DashboardScreen implements Screen {
    public constructor(private readonly dashboard: Dashboard.Model) {}

    public cata<R>(pattern: ScreenPattern<R>): R {
      return utils.callOrElse(
        pattern._,
        pattern.DashboardScreen,
        this.dashboard
      )
    }
  }
)

export const FeedbackScreen = cons<[string, Counter.Model], Screen>(
  class FeedbackScreen implements Screen {
    public constructor(
      private readonly feedbackId: string,
      private readonly counter: Counter.Model
    ) {}

    public cata<R>(pattern: ScreenPattern<R>): R {
      return utils.callOrElse(
        pattern._,
        pattern.FeedbackScreen,
        this.feedbackId,
        this.counter
      )
    }
  }
)

export const NotFoundScreen: Screen = {
  cata<R>(pattern: ScreenPattern<R>): R {
    return utils.callOrElse(pattern._, pattern.NotFoundScreen)
  }
}

const screenFromUrl = (url: Url): [Screen, Cmd<Msg>] => {
  return Router.parse(url)
    .map(route =>
      route.cata<[Screen, Cmd<Msg>]>({
        ToDashboard: () => {
          const [initialDashboard, initialCmd] = Dashboard.init

          return [
            DashboardScreen(initialDashboard),
            initialCmd.map(DashboardMsg)
          ]
        },
        ToFeedback: feedbackId => [
          FeedbackScreen(feedbackId, Counter.initial),
          Cmd.none
        ]
      })
    )
    .getOrElse([NotFoundScreen, Cmd.none])
}

// M O D E L

export type Model = {
  navigation: Router.Navigation
  screen: Screen
}

export const init = (
  initialUrl: Url,
  navigation: Router.Navigation
): [Model, Cmd<Msg>] => {
  const [initialScreen, initialCmd] = screenFromUrl(initialUrl)

  return [
    {
      navigation,
      screen: initialScreen
    },
    initialCmd
  ]
}

// U P D A T E

export type Msg = utils.Msg<[Model], [Model, Cmd<Msg>]>

export const onUrlRequest = cons(
  class RequestUrl implements Msg {
    public constructor(private readonly urlRequest: UrlRequest) {}

    public update(model: Model): [Model, Cmd<Msg>] {
      return [
        model,
        this.urlRequest.cata({
          Internal: nextUrl => model.navigation.push(nextUrl.toString()),

          External: href => model.navigation.load(href)
        })
      ]
    }
  }
)

export const onUrlChange = cons(
  class ChangeUrl implements Msg {
    public constructor(private readonly url: Url) {}

    public update(model: Model): [Model, Cmd<Msg>] {
      const [nextScreen, cmd] = screenFromUrl(this.url)

      return [{ ...model, screen: nextScreen }, cmd]
    }
  }
)

const DashboardMsg = cons(
  class implements Msg {
    public constructor(private readonly msg: Dashboard.Msg) {}

    public update(model: Model): [Model, Cmd<Msg>] {
      return model.screen.cata({
        DashboardScreen: dashboard => {
          const [nextDashboard, cmd] = this.msg.update(dashboard)

          return [
            {
              ...model,
              screen: DashboardScreen(nextDashboard)
            },
            cmd.map(DashboardMsg)
          ]
        },

        _: () => [model, Cmd.none]
      })
    }
  }
)

const FeedbackMsg = cons(
  class implements Msg {
    public constructor(private readonly msg: Counter.Msg) {}

    public update(model: Model): [Model, Cmd<Msg>] {
      return [
        model.screen.cata({
          FeedbackScreen: (feedbackId, counter) => ({
            ...model,
            screen: FeedbackScreen(feedbackId, this.msg.update(counter))
          }),

          _: () => model
        }),
        Cmd.none
      ]
    }
  }
)

// V I E W

const ViewDashboardScreen: FC<{
  dashboard: Dashboard.Model
  dispatch: Dispatch<Msg>
}> = React.memo(({ dashboard, dispatch }) => (
  <Dashboard.View
    model={dashboard}
    dispatch={msg => dispatch(DashboardMsg(msg))}
  />
))

const ViewFeedbackScreen: FC<{
  feedbackId: string
  counter: Counter.Model
  dispatch: Dispatch<Msg>
}> = React.memo(({ counter, dispatch }) => (
  <Counter.View model={counter} dispatch={msg => dispatch(FeedbackMsg(msg))} />
))

export const View: FC<{ model: Model; dispatch: Dispatch<Msg> }> = React.memo(
  ({ model, dispatch }) => {
    return model.screen.cata({
      DashboardScreen: dashboard => (
        <ViewDashboardScreen dashboard={dashboard} dispatch={dispatch} />
      ),

      FeedbackScreen: (feedbackId, counter) => (
        <ViewFeedbackScreen
          feedbackId={feedbackId}
          counter={counter}
          dispatch={dispatch}
        />
      ),

      _: () => <div>Page 404</div>
    })
  }
)
