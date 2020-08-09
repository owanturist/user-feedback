import React, { FC } from 'react'
import { action } from '@storybook/addon-actions'

import * as Http from 'frctl/Http'
import RemoteData from 'frctl/RemoteData'
import * as api from 'api'
import * as Dashboard from './index'

const [initial] = Dashboard.init

const feedbackItems: Array<api.Feedback> = new Array(20)
  .fill(0)
  .map((_, i) => ({
    id: `#${i}`,
    rating: Math.floor(Math.random() * 5) + 1,
    comment: `Lorem ipsum dolor sit amet, consectetur adipiscing elit ${i}`,
    browser: {
      name: 'Chrome',
      version: '32.0',
      device: 'Desktop',
      platform: 'MacOSX'
    }
  }))

export default {
  title: 'Dashboard',
  component: Dashboard.View
}

export const Header: FC = () => <Dashboard.Header />

export const Loading: FC = () => (
  <Dashboard.View model={initial} dispatch={action('dispatch')} />
)

export const Failure: FC = () => (
  <Dashboard.View
    model={{
      ...initial,
      feedback: RemoteData.Failure(Http.Error.Timeout)
    }}
    dispatch={action('dispatch')}
  />
)

export const Success: FC = () => (
  <Dashboard.View
    model={{
      ...initial,
      feedback: RemoteData.Succeed(feedbackItems)
    }}
    dispatch={action('dispatch')}
  />
)
