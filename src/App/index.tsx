import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled/macro'
import { Cmd } from 'frctl'
import { Cata, cons } from 'frctl/Basics'
import { Url } from 'frctl/Url'

import { Dispatch } from 'Provider'
import * as breakpoints from 'breakpoints'
import * as Router from 'Router'
import * as Dashboard from 'Dashboard'
import * as Details from 'Details'
import * as Page404 from 'Page404'
import * as utils from 'utils'

// S C R E E N

type ScreenPattern<R> = Cata<{
  DashboardScreen(dashboard: Dashboard.Model): R
  DetailsScreen(feedbackId: string, details: Details.Model): R
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

export const DetailsScreen = cons<[string, Details.Model], Screen>(
  class DetailsScreen implements Screen {
    public constructor(
      private readonly feedbackId: string,
      private readonly details: Details.Model
    ) {}

    public cata<R>(pattern: ScreenPattern<R>): R {
      return utils.callOrElse(
        pattern._,
        pattern.DetailsScreen,
        this.feedbackId,
        this.details
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
        ToDetails: feedbackId => {
          const [initialDetails, initialCmd] = Details.init(feedbackId)

          return [
            DetailsScreen(feedbackId, initialDetails),
            initialCmd.map(DetailsMsg)
          ]
        }
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
    public constructor(private readonly urlRequest: Router.UrlRequest) {}

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
  class DashboardMsg_ implements Msg {
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

const DetailsMsg = cons(
  class DetailsMsg_ implements Msg {
    public constructor(private readonly msg: Details.Msg) {}

    public update(model: Model): [Model, Cmd<Msg>] {
      return model.screen.cata({
        DetailsScreen: (feedbackId, details) => {
          const [nextDetails, cmd] = this.msg.update(details)

          return [
            {
              ...model,
              screen: DetailsScreen(feedbackId, nextDetails)
            },
            cmd.map(DetailsMsg)
          ]
        },

        _: () => [model, Cmd.none]
      })
    }
  }
)

// V I E W

const StyledHeader = styled.header`
  box-sizing: border-box;
  position: relative; /* shadow overflow of content */
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 0 0 auto;
  min-height: 67px;
  padding: 5px 16px;
  margin: 0;
  color: #5e6264;
  background: #fff;
  box-shadow: 0 0 2px 2px #dadee0;
  font-weight: 600;
  font-size: 26px;
  letter-spacing: 0.02em;
  user-select: none;
`

const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  padding: 16px;
  width: 100%;
  max-width: 1454px;

  @media ${breakpoints.big.minWidth} {
    padding-top: 28px;
  }
`

const StyledScroller = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  scroll-behavior: smooth;
`

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const ViewScreen: FC<{ header: ReactNode }> = ({
  header,
  children,
  ...props
}) => (
  <StyledRoot {...props}>
    <StyledHeader>{header}</StyledHeader>

    <StyledScroller>
      <StyledContainer>{children}</StyledContainer>
    </StyledScroller>
  </StyledRoot>
)

const ViewDashboardScreen: FC<{
  dashboard: Dashboard.Model
  dispatch: Dispatch<Msg>
}> = ({ dashboard, dispatch }) => (
  <ViewScreen header={<Dashboard.Header />}>
    <Dashboard.View
      model={dashboard}
      dispatch={React.useCallback(msg => dispatch(DashboardMsg(msg)), [
        dispatch
      ])}
    />
  </ViewScreen>
)

const ViewDetailsScreen: FC<{
  feedbackId: string
  details: Details.Model
  dispatch: Dispatch<Msg>
}> = ({ feedbackId, details, dispatch }) => (
  <ViewScreen header={<Details.Header model={details} />}>
    <Details.View
      feedbackId={feedbackId}
      model={details}
      dispatch={React.useCallback(msg => dispatch(DetailsMsg(msg)), [dispatch])}
    />
  </ViewScreen>
)

export const View: FC<{ model: Model; dispatch: Dispatch<Msg> }> = React.memo(
  ({ model, dispatch }) =>
    model.screen.cata({
      DashboardScreen: dashboard => (
        <ViewDashboardScreen dashboard={dashboard} dispatch={dispatch} />
      ),

      DetailsScreen: (feedbackId, details) => (
        <ViewDetailsScreen
          feedbackId={feedbackId}
          details={details}
          dispatch={dispatch}
        />
      ),

      _: () => (
        <ViewScreen header={<Page404.Header />}>
          <Page404.View />
        </ViewScreen>
      )
    })
)
