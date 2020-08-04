import React, { FC } from 'react'
import { action } from '@storybook/addon-actions'

import * as Dashboard from './index'

export default {
  title: 'Dashboard',
  component: Dashboard.View
}

export const Initial: FC = () => (
  <Dashboard.View model={Dashboard.initial} dispatch={action('dispatch')} />
)
