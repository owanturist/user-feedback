import React from 'react'
import { text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import Decode from 'frctl/Json/Decode'

import HttpFailureReport from '.'

export default {
  title: 'HttpFailureReport',
  component: HttpFailureReport
}

export const StringError: React.FC = () => (
  <HttpFailureReport
    error={text('Message', 'Request failed with status code 403')}
    onTryAgain={action('onTryAgain')}
  />
)

export const DecodeError: React.FC = () => (
  <HttpFailureReport
    error={Decode.Error.Field(
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
    )}
    onTryAgain={action('onTryAgain')}
  />
)
