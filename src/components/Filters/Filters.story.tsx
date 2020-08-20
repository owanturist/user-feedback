import React from 'react'
import { action } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs'

import { Rating } from 'api'
import { Filters, FiltersSkeleton } from '.'

export default {
  title: 'Filters',
  component: Filters
}

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

export const Skeleton: React.FC = () => <FiltersSkeleton />

export const Initial: React.FC = () => (
  <Filters
    search={text('Search', '')}
    excludeRatings={ratingsKnob([])}
    onSearchChange={action('onSearchChange')}
    onToggleRating={action('onToggleRating')}
  />
)

export const Filled: React.FC = () => (
  <Filters
    search={text('Search', '')}
    excludeRatings={ratingsKnob([1, 3, 4])}
    onSearchChange={action('onSearchChange')}
    onToggleRating={action('onToggleRating')}
  />
)
