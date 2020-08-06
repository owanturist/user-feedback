import React, { FC } from 'react'
import { action } from '@storybook/addon-actions'
import { number } from '@storybook/addon-knobs'

import * as Counter from './index'

export default {
  title: 'Counter',
  component: Counter.View
}

export const Initial: FC = () => (
  <Counter.View
    model={{
      count: number('Count', 0)
    }}
    dispatch={action('dispatch')}
  />
)
