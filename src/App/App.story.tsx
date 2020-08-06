import React, { FC } from 'react'
import { text, number } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import RemoteData from 'frctl/RemoteData'
import Decode from 'frctl/Json/Decode'
import { Url } from 'frctl/Url'
import * as Http from 'frctl/Http'

import * as App from './index'
import type { Navigation } from 'Router'

export default {
  title: 'App',
  component: App.View
}

const fakeUrl = Url.cons(Url.Http, '')
const fakeNavigation: Navigation = ({} as unknown) as Navigation

const initial = App.init(fakeUrl, fakeNavigation)[0]

export const Initial: FC = () => (
  <App.View model={initial} dispatch={action('dispatch')} />
)

export const FailureNetworkError: FC = () => (
  <App.View
    model={{
      ...initial,
      feedback: RemoteData.Failure(Http.Error.NetworkError)
    }}
    dispatch={action('dispatch')}
  />
)

export const FailureTimeout: FC = () => (
  <App.View
    model={{
      ...initial,
      feedback: RemoteData.Failure(Http.Error.Timeout)
    }}
    dispatch={action('dispatch')}
  />
)

export const FailureBadUrl: FC = () => (
  <App.View
    model={{
      ...initial,
      feedback: RemoteData.Failure(Http.Error.BadUrl(text('Url', 'wrongurl')))
    }}
    dispatch={action('dispatch')}
  />
)

export const FailureBadStatus500: FC = () => (
  <App.View
    model={{
      ...initial,
      feedback: RemoteData.Failure(
        Http.Error.BadStatus({
          url: text('Url', 'https://google.com'),
          statusCode: number('Status Code', 501),
          statusText: text('Status Text', 'NotFound'),
          headers: {},
          body: ''
        })
      )
    }}
    dispatch={action('dispatch')}
  />
)

export const FailureBadStatus400: FC = () => (
  <App.View
    model={{
      ...initial,
      feedback: RemoteData.Failure(
        Http.Error.BadStatus({
          url: text('Url', 'https://google.com'),
          statusCode: number('Status Code', 404),
          statusText: text('Status Text', 'NotFound'),
          headers: {},
          body: ''
        })
      )
    }}
    dispatch={action('dispatch')}
  />
)

export const FailureBadBody: FC = () => (
  <App.View
    model={{
      ...initial,
      feedback: RemoteData.Failure(
        Http.Error.BadBody(
          Decode.Error.Field(
            'items',
            Decode.Error.Index(
              0,
              Decode.Error.Failure(
                text('Failure Message', 'Expect STRING but get NUMBER'),
                JSON.stringify(
                  {
                    items: [123, '456']
                  },
                  null,
                  4
                )
              )
            )
          ),
          {
            url: 'https://google.com',
            statusCode: 200,
            statusText: 'OK',
            headers: {},
            body: ''
          }
        )
      )
    }}
    dispatch={action('dispatch')}
  />
)
