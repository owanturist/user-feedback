import React from 'react'
import { text, number } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import Decode from 'frctl/Json/Decode'
import * as Http from 'frctl/Http'

import HttpFailureReport from '.'

export default {
  title: 'HttpFailureReport',
  component: HttpFailureReport
}

export const NetworkError: React.FC = () => (
  <HttpFailureReport
    error={Http.Error.NetworkError}
    onTryAgain={action('onTryAgain')}
  />
)

export const Timeout: React.FC = () => (
  <HttpFailureReport
    error={Http.Error.Timeout}
    onTryAgain={action('onTryAgain')}
  />
)

export const BadUrl: React.FC = () => (
  <HttpFailureReport
    error={Http.Error.BadUrl(text('Url', 'wrongurl'))}
    onTryAgain={action('onTryAgain')}
  />
)

export const BadStatus500: React.FC = () => (
  <HttpFailureReport
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

export const BadStatus400: React.FC = () => (
  <HttpFailureReport
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

export const BadBody: React.FC = () => (
  <HttpFailureReport
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
