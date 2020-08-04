import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import { number } from '@storybook/addon-knobs'

import * as Skeleton from './index'

export default {
  title: 'Skeleton'
}

const StyledContainer = styled.div<{
  font: number
}>`
  background: #cfc;
  font-size: ${props => props.font}px;
`

export const Text: FC = () => (
  <StyledContainer font={number('Font size', 14)}>
    <Skeleton.Text count={number('Count', 10)} />
  </StyledContainer>
)

export const Rect: FC = () => (
  <StyledContainer font={number('Font size', 14)}>
    <Skeleton.Rect
      width={number('Width', 200)}
      height={number('Height', 100)}
    />
  </StyledContainer>
)

export const Circle: FC = () => (
  <StyledContainer font={number('Font size', 14)}>
    <Skeleton.Circle size={number('Size', 200)} />
  </StyledContainer>
)
