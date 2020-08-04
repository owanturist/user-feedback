import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import * as Skelet from 'Skeleton'

import * as api from 'api'

const limitRating = (rating: number): string =>
  (rating || 0).toString().slice(0, 2)

const StyledRoot = styled.span`
  box-sizing: border-box;
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #1ea0be;
  color: #e5ecf2;
  background: #1ea0be;
  font-weight: 600;
  font-size: 22px;
  line-height: 36px; /* centers vertically */
  text-align: center;
  user-select: none;
`

type StyledInteractiveRootProps = {
  active?: boolean
}

const StyledInteractiveRoot = styled(StyledRoot)<StyledInteractiveRootProps>`
  outline: none;
  cursor: pointer;
  color: ${props => !props.active && '#ddd'};
  background: ${props => !props.active && 'transparent'};
  border-color: ${props => !props.active && '#ddd'};
  transition: all 0.2s ease-in-out;
`

export const Static: FC<{
  rating: api.Rating
}> = ({ rating }) => <StyledRoot>{limitRating(rating)}</StyledRoot>

export const Interactive: FC<{
  rating: api.Rating
  active: boolean
  onChange(active: boolean): void
}> = ({ rating, active, onChange }) => (
  <StyledInteractiveRoot
    tabIndex={0}
    active={active}
    onClick={() => onChange(!active)}
  >
    {limitRating(rating)}
  </StyledInteractiveRoot>
)

export const Skeleton: FC = () => <Skelet.Circle size="40px" />
