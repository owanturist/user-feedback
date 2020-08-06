import React, { FC } from 'react'
import { action } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs'
import Set from 'frctl/Set'

import * as api from 'api'
import * as Filters from './index'

export default {
  title: 'Filters',
  component: Filters
}

const ratingsKnob = (active: Array<api.Rating>): Set<api.Rating> => {
  const arr: Array<api.Rating> = []

  for (let i = 1; i <= 5; i++) {
    if (boolean(`Rating ${i}`, active.indexOf(i) >= 0)) {
      arr.push(i)
    }
  }

  return Set.fromList(arr)
}

export const Skeleton: FC = () => <Filters.Skeleton />

export const Initial: FC = () => (
  <Filters.View
    model={{
      ...Filters.initial,
      ratings: ratingsKnob([]),
      search: text('Search', '')
    }}
    dispatch={action('dispatch')}
  />
)

export const Filled: FC = () => (
  <Filters.View
    model={{
      ...Filters.initial,
      ratings: ratingsKnob([1, 3, 4]),
      search: text('Search', 'Some comment')
    }}
    dispatch={action('dispatch')}
  />
)
