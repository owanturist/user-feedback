import React from 'react'
import { action } from '@storybook/addon-actions'
import { number, boolean } from '@storybook/addon-knobs'

import RatingMark, { RatingMarkStatic, RatingMarkSkeleton } from '.'

export default {
  title: 'RatingMark',
  component: RatingMark
}

export const Skeleton: React.FC = () => <RatingMarkSkeleton />

export const Static: React.FC = () => (
  <RatingMarkStatic rating={number('RatingMark', 1)} />
)

export const Interactive: React.FC = () => (
  <RatingMark
    active={boolean('Active', true)}
    rating={number('RatingMark', 1)}
    onChange={action('onChange')}
  />
)
