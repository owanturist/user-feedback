import React, { FC } from 'react'
import { action } from '@storybook/addon-actions'

import * as api from 'api'
import * as Dashboard from './index'

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

export const Skeleton: FC = () => <Dashboard.Skeleton />

export const Initial: FC = () => (
  <Dashboard.View
    feedback={feedbackItems}
    model={Dashboard.initial}
    dispatch={action('dispatch')}
  />
)
