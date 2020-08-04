import React, { FC } from 'react'
import { action } from '@storybook/addon-actions'
import { number } from '@storybook/addon-knobs'

import * as Dashboard from './index'

export default {
  title: 'Dashboard',
  component: Dashboard.View
}

export const Initial: FC = () => (
  <Dashboard.View
    model={{
      foo: number('Count', 0)
    }}
    dispatch={action('dispatch')}
  />
)
