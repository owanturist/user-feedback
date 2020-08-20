import React from 'react'
import styled from '@emotion/styled/macro'
import { number } from '@storybook/addon-knobs'

import { SkeletonText, SkeletonRect, SkeletonCircle } from '.'

export default {
  title: 'Skeleton'
}

const StyledContainer = styled.div<{
  font: number
}>`
  background: #cfc;
  font-size: ${props => props.font}px;
`

export const Text: React.FC = () => (
  <StyledContainer font={number('Font size', 14)}>
    <SkeletonText count={number('Count', 10)} />
  </StyledContainer>
)

export const Rect: React.FC = () => (
  <StyledContainer font={number('Font size', 14)}>
    <SkeletonRect width={number('Width', 200)} height={number('Height', 100)} />
  </StyledContainer>
)

export const Circle: React.FC = () => (
  <StyledContainer font={number('Font size', 14)}>
    <SkeletonCircle size={number('Size', 200)} />
  </StyledContainer>
)
