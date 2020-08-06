import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion/macro'
import Set from 'frctl/Set'

import { Dispatch } from 'Provider'
import * as utils from 'utils'
import * as breakpoints from 'breakpoints'
import * as api from 'api'
import * as Skelet from 'Skeleton'
import * as Rating from 'Rating'

// M O D E L

export type Model = {
  search: string
  ratings: Set<api.Rating>
}

export const initial: Model = {
  search: '',
  ratings: Set.fromList([
    api.Rating.One,
    api.Rating.Two,
    api.Rating.Three,
    api.Rating.Four,
    api.Rating.Five
  ])
}

export const isPass = (model: Model, feedback: api.Feedback): boolean => {
  return (
    model.ratings.member(feedback.rating) &&
    feedback.comment.indexOf(model.search) >= 0
  )
}

// U P D A T E

export type Msg = utils.Msg<[Model], Model>

const ChangeSearch = utils.cons(
  class ChangeSearch implements Msg {
    public constructor(private readonly input: string) {}

    public update(model: Model): Model {
      return {
        ...model,
        search: this.input
      }
    }
  }
)

const ToggleRating = utils.cons(
  class ToggleRating implements Msg {
    public constructor(private readonly rating: api.Rating) {}

    public update(model: Model): Model {
      return {
        ...model,
        ratings: model.ratings.toggle(this.rating)
      }
    }
  }
)

// V I E W

const RATINGS_RANGE = [
  api.Rating.One,
  api.Rating.Two,
  api.Rating.Three,
  api.Rating.Four,
  api.Rating.Five
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

const ViewRatings: FC<{
  selected: Set<api.Rating>
  dispatch: Dispatch<Msg>
}> = React.memo(({ selected, dispatch }) => (
  <StyledRatings>
    {RATINGS_RANGE.map(rating => (
      <Rating.Interactive
        key={rating}
        className={cssRating}
        active={selected.member(rating)}
        rating={rating}
        onChange={React.useCallback(() => dispatch(ToggleRating(rating)), [
          rating
        ])}
      />
    ))}
  </StyledRatings>
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
  color: #59636b;
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

export const View: FC<{
  className?: string
  model: Model
  dispatch: Dispatch<Msg>
}> = React.memo(({ className, model, dispatch }) => (
  <StyledRoot className={className}>
    <StyledInputContainer>
      <StyledInput
        data-cy="filters__search-input"
        autoFocus
        tabIndex={0}
        type="search"
        placeholder="Search here!"
        value={model.search}
        onChange={React.useCallback(
          event => dispatch(ChangeSearch(event.target.value)),
          [dispatch]
        )}
      />
    </StyledInputContainer>

    <ViewRatings selected={model.ratings} dispatch={dispatch} />
  </StyledRoot>
))

// S K E L E T O N

export const Skeleton: FC<{
  className?: string
}> = React.memo(({ className }) => (
  <StyledRoot className={className}>
    <StyledInputContainer>
      <Skelet.Rect width="100%" height="40px" />
    </StyledInputContainer>

    <StyledRatings>
      {RATINGS_RANGE.map(rating => (
        <Rating.Skeleton key={rating} className={cssRating} />
      ))}
    </StyledRatings>
  </StyledRoot>
))
