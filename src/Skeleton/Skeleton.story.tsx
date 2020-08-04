import React, { FC } from 'react'
import { number } from '@storybook/addon-knobs'

import * as Skeleton from './index'

export default {
  title: 'Skeleton'
}

export const Text: FC = () => (
  <div>
    <Skeleton.Text count={number('Count', 10)} />
  </div>
)

export const Rect: FC = () => (
  <div>
    <Skeleton.Rect
      width={number('Width', 200)}
      height={number('Height', 100)}
    />
  </div>
)

export const Circle: FC = () => (
  <div>
    <Skeleton.Circle size={number('Size', 200)} />
  </div>
)
