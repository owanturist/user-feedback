import React, { FC } from 'react'
import { text, number } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import Decode from 'frctl/Json/Decode'
import * as Http from 'frctl/Http'

import FailureReport from './index'

export default {
  title: 'HttpFailureReport',
  component: FailureReport
}

export const NetworkError: FC = () => (
  <FailureReport
    error={Http.Error.NetworkError}
    onTryAgain={action('onTryAgain')}
  />
)

export const Timeout: FC = () => (
  <FailureReport error={Http.Error.Timeout} onTryAgain={action('onTryAgain')} />
)

export const BadUrl: FC = () => (
  <FailureReport
    error={Http.Error.BadUrl(text('Url', 'wrongurl'))}
    onTryAgain={action('onTryAgain')}
  />
)

export const BadStatus500: FC = () => (
  <FailureReport
    error={Http.Error.BadStatus({
      url: text('Url', 'https://google.com'),
      statusCode: number('Status Code', 501),
      statusText: text('Status Text', 'NotFound'),
      headers: {},
      body: ''
    })}
    onTryAgain={action('onTryAgain')}
  />
)

export const BadStatus400: FC = () => (
  <FailureReport
    error={Http.Error.BadStatus({
      url: text('Url', 'https://google.com'),
      statusCode: number('Status Code', 404),
      statusText: text('Status Text', 'NotFound'),
      headers: {},
      body: ''
    })}
    onTryAgain={action('onTryAgain')}
  />
)

export const BadBody: FC = () => (
  <FailureReport
    error={Http.Error.BadBody(
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
    )}
    onTryAgain={action('onTryAgain')}
  />
)
