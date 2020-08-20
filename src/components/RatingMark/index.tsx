import React from 'react'
import styled from '@emotion/styled/macro'

import theme from 'theme'
import { Rating } from 'api'
import { SkeletonCircle } from 'components/Skeleton'

const limitRating = (rating: number): string =>
  (rating || 0).toString().slice(0, 2)

const StyledRoot = styled.span`
  box-sizing: border-box;
  display: inline-block;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  border: 2px solid ${theme.primary};
  color: ${theme.cloud};
  background: ${theme.primary};
  font-weight: 600;
  font-size: 22px;
  font-family: inherit;
  line-height: 36px; /* centers vertically */
  text-align: center;
  user-select: none;
`

type StyledInteractiveRootProps = {
  active?: boolean
}

const StyledInteractiveRoot = styled(StyledRoot.withComponent('button'))<
  StyledInteractiveRootProps
>`
  outline: none;
  cursor: pointer;
  color: ${props => !props.active && '#ddd'};
  background: ${props => !props.active && 'transparent'};
  border-color: ${props => !props.active && '#ddd'};
  transition: all 0.2s ease-in-out;

  &:focus {
    box-shadow: 0 0 0 2px
      ${props =>
        props.active ? 'rgb(30, 160, 190, 0.5)' : 'rgb(221, 221, 221, 0.6)'};
  }
`

export const RatingMarkStatic: React.FC<{
  className?: string
  rating: Rating
}> = React.memo(({ className, rating }) => (
  <StyledRoot className={className} data-cy={`rating__static_${rating}`}>
    {limitRating(rating)}
  </StyledRoot>
))

const RatingMark: React.FC<{
  className?: string
  rating: Rating
  active: boolean
  onChange(active: boolean): void
}> = React.memo(({ className, rating, active, onChange }) => (
  <StyledInteractiveRoot
    data-cy={`rating__interactive_${rating}`}
    className={className}
    tabIndex={0}
    active={active}
    onClick={React.useCallback(() => onChange(!active), [active, onChange])}
  >
    {limitRating(rating)}
  </StyledInteractiveRoot>
))

export default RatingMark

export const RatingMarkSkeleton: React.FC<{
  className?: string
  inline?: boolean
}> = React.memo(({ className, inline }) => (
  <SkeletonCircle className={className} inline={inline} size="40px" />
))
