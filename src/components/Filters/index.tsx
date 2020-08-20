import React from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion/macro'

import theme from 'theme'
import breakpoints from 'breakpoints'
import { Rating } from 'api'
import { SkeletonRect } from 'components/Skeleton'
import RatingMark, { RatingMarkSkeleton } from 'components/RatingMark'

const RATINGS_RANGE = [
  Rating.One,
  Rating.Two,
  Rating.Three,
  Rating.Four,
  Rating.Five
]

const cssRating = css`
  margin-left: 10px;

  @media ${breakpoints.small.minWidth} {
    margin-left: 17px;
  }
`

const StyledRatings = styled.span`
  display: flex;
  flex-flow: row wrap;
  margin-top: 10px;
  margin-left: -10px;

  @media ${breakpoints.small.minWidth} {
    margin-top: 0;
    margin-left: 10px;
  }

  @media ${breakpoints.big.minWidth} {
    margin-left: 24px;
  }
`

const ViewRating: React.FC<{
  rating: Rating
  excludeRatings: Record<number, boolean>
  onToggleRating(rating: Rating): void
}> = React.memo(({ rating, excludeRatings, onToggleRating }) => (
  <RatingMark
    className={cssRating}
    active={!excludeRatings[rating]}
    rating={rating}
    onChange={() => onToggleRating(rating)}
  />
))

const StyledInputContainer = styled.div`
  width: 100%;

  @media ${breakpoints.small.minWidth} {
    width: 224px;
  }
`

const StyledInput = styled.input`
  box-sizing: border-box;
  height: 40px;
  width: 100%;
  padding: 0 13px 2px;
  border-radius: 3px;
  border: 2px solid #ddd;
  color: ${theme.dark};
  background: #fff;
  font-size: 15px;
  letter-spacing: 0.02em;
  font-family: inherit;
  outline: none;
  transition: box-shadow 0.2s ease-in-out;

  &:focus {
    box-shadow: 0 0 0 2px rgb(221, 221, 221, 0.6);
  }
`

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex-flow: row wrap;
`

export const Filters: React.FC<{
  className?: string
  search: string
  excludeRatings: Record<number, boolean>
  onSearchChange(search: string): void
  onToggleRating(rating: Rating): void
}> = React.memo(
  ({ className, search, excludeRatings, onSearchChange, onToggleRating }) => (
    <StyledRoot className={className}>
      <StyledInputContainer>
        <StyledInput
          data-cy="filters__search-input"
          autoFocus
          tabIndex={0}
          type="search"
          placeholder="Search here!"
          value={search}
          onChange={event => onSearchChange(event.target.value)}
        />
      </StyledInputContainer>

      <StyledRatings>
        {RATINGS_RANGE.map(rating => (
          <ViewRating
            key={rating}
            excludeRatings={excludeRatings}
            rating={rating}
            onToggleRating={onToggleRating}
          />
        ))}
      </StyledRatings>
    </StyledRoot>
  )
)

// S K E L E T O N

export const FiltersSkeleton: React.FC<{
  className?: string
}> = ({ className }) => (
  <StyledRoot className={className}>
    <StyledInputContainer>
      <SkeletonRect width="100%" height="40px" />
    </StyledInputContainer>

    <StyledRatings>
      {RATINGS_RANGE.map(rating => (
        <RatingMarkSkeleton key={rating} className={cssRating} />
      ))}
    </StyledRatings>
  </StyledRoot>
)
