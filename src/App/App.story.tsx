import React, { FC } from 'react'
import { action } from '@storybook/addon-actions'

import { Url } from 'frctl/Url'
import RemoteData from 'frctl/RemoteData'
import OptionalRemoteData from 'frctl/RemoteData/Optional'
import * as Http from 'frctl/Http'

import * as Router from 'Router'
import * as App from './index'
import * as Dashboard from 'components/Dashboard'
import * as Details from 'components/Details'

export default {
  title: 'App',
  component: App.View
}

const fakeUrl = Url.cons(Url.Https, 'google.com')
const fakeNavigation = (null as unknown) as Router.Navigation
const [initial] = App.init(fakeUrl, fakeNavigation)

export const ScreenDashboard: FC = () => (
  <App.View
    model={{
      ...initial,
      screen: App.DashboardScreen(Dashboard.initial)
    }}
    dispatch={action('dispatch')}
  />
)

export const ScreenDashboardFailed: FC = () => (
  <App.View
    model={{
      ...initial,
      screen: App.DashboardScreen({
        ...Dashboard.initial,
        feedback: RemoteData.Failure(Http.Error.Timeout)
      })
    }}
    dispatch={action('dispatch')}
  />
)

export const ScreenDetails: FC = () => (
  <App.View
    model={{
      ...initial,
      screen: App.DetailsScreen('feedback-id', Details.initial)
    }}
    dispatch={action('dispatch')}
  />
)

export const ScreenDetailsNotFound: FC = () => (
  <App.View
    model={{
      ...initial,
      screen: App.DetailsScreen('feedback-id', {
        ...Details.initial,
        feedback: OptionalRemoteData.NotAsked
      })
    }}
    dispatch={action('dispatch')}
  />
)

export const ScreenDetailsFailed: FC = () => (
  <App.View
    model={{
      ...initial,
      screen: App.DetailsScreen('feedback-id', {
        ...Details.initial,
        feedback: OptionalRemoteData.Failure(Http.Error.Timeout)
      })
    }}
    dispatch={action('dispatch')}
  />
)

export const ScreenNotFound: FC = () => (
  <App.View
    model={{
      ...initial,
      screen: App.NotFoundScreen
    }}
    dispatch={action('dispatch')}
  />
)
