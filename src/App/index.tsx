import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import { Cmd } from 'frctl'
import { cons } from 'frctl/Basics'
import { Url } from 'frctl/Url'
import * as Http from 'frctl/Http'
import RemoteData from 'frctl/RemoteData'
import Either from 'frctl/Either'

import * as api from 'api'
import { Dispatch, UrlRequest } from 'Provider'
import * as Router from 'Router'
import * as Dashboard from 'Dashboard'
import * as Counter from 'Counter'
import * as utils from 'utils'

// S C R E E N

type Screen =
  | { type: 'DashboardScreen'; dashboard: Dashboard.Model }
  | { type: 'FeedbackScreen'; feedbackId: string; counter: Counter.Model }
  | { type: 'NotFoundScreen' }

const DashboardScreen = (dashboard: Dashboard.Model): Screen => ({
  type: 'DashboardScreen',
  dashboard
})

const FeedbackScreen = (
  feedbackId: string,
  counter: Counter.Model
): Screen => ({ type: 'FeedbackScreen', feedbackId, counter })

const NotFoundScreen: Screen = { type: 'NotFoundScreen' }

const screenFromUrl = (url: Url): Screen => {
  return Router.parse(url)
    .map(route => {
      switch (route.type) {
        case 'ToDashboard':
          return DashboardScreen(Dashboard.initial)
        case 'ToFeedback':
          return FeedbackScreen(route.feedbackId, Counter.initial)
      }
    })
    .getOrElse(NotFoundScreen)
}

// M O D E L

export type Model = {
  navigation: Router.Navigation
  feedback: RemoteData<Http.Error, Array<api.Feedback>>
  screen: Screen
}

export const init = (
  initialUrl: Url,
  navigation: Router.Navigation
): [Model, Cmd<Msg>] => [
  {
    navigation,
    feedback: RemoteData.Loading,
    screen: screenFromUrl(initialUrl)
  },
  api.getFeedback.send(result => LoadFeedbackDone(result))
]

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
      return [{ ...model, screen: screenFromUrl(this.url) }, Cmd.none]
    }
  }
)

const LoadFeedback: Msg = {
  update(model: Model): [Model, Cmd<Msg>] {
    return [
      {
        ...model,
        feedback: RemoteData.Loading
      },
      api.getFeedback.send(result => LoadFeedbackDone(result))
    ]
  }
}

const LoadFeedbackDone = cons(
  class LoadFeedbackDone implements Msg {
    public constructor(
      private readonly result: Either<Http.Error, Array<api.Feedback>>
    ) {}

    public update(model: Model): [Model, Cmd<Msg>] {
      return [
        {
          ...model,
          feedback: RemoteData.fromEither(this.result)
        },
        Cmd.none
      ]
    }
  }
)

const DashboardMsg = cons(
  class DashboardMsg_ implements Msg {
    public constructor(private readonly msg: Dashboard.Msg) {}

    public update(model: Model): [Model, Cmd<Msg>] {
      switch (model.screen.type) {
        case 'DashboardScreen': {
          const [nextDashboard, cmd] = this.msg.update(model.screen.dashboard)

          return [
            {
              ...model,
              screen: DashboardScreen(nextDashboard)
            },
            cmd.map(DashboardMsg)
          ]
        }

        default: {
          return [model, Cmd.none]
        }
      }
    }
  }
)

// V I E W

const StyledTryAgain = styled.button`
  box-sizing: border-box;
  display: inline-block;
  height: 40px;
  margin-top: 30px;
  padding: 9px 18px;
  border: none;
  border-radius: 3px;
  color: #e5ecf2;
  background: #1ea0be;
  font-weight: 600;
  font-size: 22px;
  font-family: inherit;
  line-height: 1;
  user-select: none;
  outline: none;
  cursor: pointer;
  transition: box-shadow 0.2s ease-in-out;

  &:focus {
    box-shadow: 0 0 0 2px rgb(30, 160, 190, 0.5);
  }
`

const ViewTryAgain: FC<{ onTryAgain(): void }> = ({ onTryAgain }) => (
  <StyledTryAgain
    data-cy="app__retry"
    autoFocus
    type="button"
    tabIndex={0}
    onClick={onTryAgain}
  >
    Try Again
  </StyledTryAgain>
)

const StyledErrorTitle = styled.h1`
  margin: 0;
  font-weight: 600;
  font-size: 24px;
`

const StyledErrorDescription = styled.p`
  margin: 20px 0 0;
  font-size: 18px;
`

const StyledErrorPre = styled.pre`
  margin: 20px 0 0;
  max-width: 100%;
  overflow: auto;
  font-size: 13px;
  text-align: left;
`

const StyledErrorPanel = styled.div`
  box-sizing: border-box;
  max-width: 560px;
  padding: 50px;
  border-radius: 3px;
  color: #59636b;
  background: #fff;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
  text-align: center;
  word-break: break-word;
  overflow-y: auto;
`

const StyledError = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`

const ViewError: FC<{ error: Http.Error; onTryAgain(): void }> = ({
  error,
  onTryAgain
}) => (
  <StyledError>
    {error.cata({
      NetworkError: () => (
        <StyledErrorPanel>
          <StyledErrorTitle>You are facing a Network Error</StyledErrorTitle>
          <StyledErrorDescription>
            Pleace check your Internet connection and try again.
          </StyledErrorDescription>

          <ViewTryAgain onTryAgain={onTryAgain} />
        </StyledErrorPanel>
      ),

      Timeout: () => (
        <StyledErrorPanel>
          <StyledErrorTitle>You are facing a Timeout issue</StyledErrorTitle>
          <StyledErrorDescription>
            It takes too long to get a response so please check your Internect
            connection and try again.
          </StyledErrorDescription>

          <ViewTryAgain onTryAgain={onTryAgain} />
        </StyledErrorPanel>
      ),

      BadUrl: url => (
        <StyledErrorPanel>
          <StyledErrorTitle>Oops... we broke something...</StyledErrorTitle>
          <StyledErrorDescription>
            It looks like the app hits a wrong endpoint <code>{url}</code>.
          </StyledErrorDescription>
          <StyledErrorDescription>
            We are fixing the issue.
          </StyledErrorDescription>
        </StyledErrorPanel>
      ),

      BadStatus: ({ statusCode }) => {
        const [side, role] =
          statusCode < 500 ? ['Client', 'frontend'] : ['Server', 'backend']

        return (
          <StyledErrorPanel>
            <StyledErrorTitle>
              You are facing an unexpected {side}&nbsp;side&nbsp;Error&nbsp;
              {statusCode}!
            </StyledErrorTitle>

            <StyledErrorDescription>
              Our {role} developers are fixing the issue.
            </StyledErrorDescription>
          </StyledErrorPanel>
        )
      },

      BadBody: decodeError => (
        <StyledErrorPanel>
          <StyledErrorTitle>
            You are facing an unexpected Response Body Error!
          </StyledErrorTitle>

          <StyledErrorDescription>
            Something went wrong and our apps seems don't communicate well...
          </StyledErrorDescription>

          <StyledErrorPre>
            {decodeError
              .stringify(4)
              .replace(/\\"/g, '"')
              .replace(/\s{2}\s+"/, '\n\n"')
              .replace(/\\n/g, '\n')}
          </StyledErrorPre>
        </StyledErrorPanel>
      )
    })}
  </StyledError>
)

export const View: FC<{ model: Model; dispatch: Dispatch<Msg> }> = React.memo(
  ({ model, dispatch }) =>
    model.feedback.cata({
      Loading: () => <Dashboard.Skeleton />,

      Failure: error => (
        <ViewError
          error={error}
          onTryAgain={React.useCallback(() => dispatch(LoadFeedback), [])}
        />
      ),

      Succeed: feedback => {
        switch (model.screen.type) {
          case 'DashboardScreen': {
            return (
              <Dashboard.View
                feedback={feedback}
                model={model.screen.dashboard}
                dispatch={msg => dispatch(DashboardMsg(msg))}
              />
            )
          }

          case 'FeedbackScreen': {
            return <div>{model.screen.feedbackId}</div>
          }

          case 'NotFoundScreen': {
            return <div>Not Found</div>
          }
        }
      }
    })
)
