import React, { FC } from 'react'
import { text, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import { Feedback, Rating } from 'api'
import { Fragment, fragmentize } from 'utils'
import { Dashboard, DashboardSkeleton } from './index'

const ratingsKnob = (
  active: Array<Rating>
): {
  [rating: number]: boolean
} => {
  const acc: {
    [rating: number]: boolean
  } = {}

  for (let i = 1; i <= 5; i++) {
    acc[i] = boolean(`Exclude rating ${i}`, active.indexOf(i) >= 0)
  }

  return acc
}

const itemsKnob = (search: string): Array<Feedback<Array<Fragment>>> => {
  return new Array(20).fill(0).map((_, i) => ({
    id: `#${i}`,
    rating: Math.floor(Math.random() * 5) + 1,
    comment:
      fragmentize(
        search,
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit ${i}`
      ) || [],
    browser: {
      name: 'Chrome',
      version: '32.0',
      device: 'Desktop',
      platform: 'MacOSX'
    }
  }))
}

export default {
  title: 'Dashboard',
  component: Dashboard
}

export const Loading: FC = () => <DashboardSkeleton />

export const Success: FC = () => {
  const search = text('search', '')

  return (
    <Dashboard
      items={itemsKnob(search)}
      search={search}
      excludeRatings={ratingsKnob([Rating.One, Rating.Three])}
      onSearchChange={action('onSearchChange')}
      onToggleRating={action('onToggleRating')}
    />
  )
}
