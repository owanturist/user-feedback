import React, { FC } from 'react'
import { action } from '@storybook/addon-actions'
import { number, boolean } from '@storybook/addon-knobs'

import * as Rating from './index'

export default {
  title: 'Rating',
  component: Rating
}

export const Skeleton: FC = () => <Rating.Skeleton />

export const Static: FC = () => <Rating.Static rating={number('Rating', 1)} />

export const Interactive: FC = () => (
  <Rating.Interactive
    active={boolean('Active', true)}
    rating={number('Rating', 1)}
    onChange={action('onChange')}
  />
)
