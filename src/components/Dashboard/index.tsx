import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion/macro'
import { Cmd } from 'frctl'
import { cons } from 'frctl/Basics'
import * as Http from 'frctl/Http'
import Either from 'frctl/Either'
import RemoteData from 'frctl/RemoteData'

import { Dispatch } from 'Provider'
import * as breakpoints from 'breakpoints'
import * as api from 'api'
import * as utils from 'utils'
import * as Filters from 'components/Filters'
import * as FeedbackTable from 'components/FeedbackTable'
import HttpFailureReport from 'components/HttpFailureReport'
import { ReactComponent as TachometerIcon } from './tachometer.svg'

// M O D E L

export type Model = {
  feedback: RemoteData<Http.Error, Array<api.Feedback>>
  filters: Filters.Model
}

export const initial: Model = {
  feedback: RemoteData.Loading,
  filters: Filters.initial
}

export const init: [Model, Cmd<Msg>] = [
  initial,
  api.getFeedbackList.send(result => LoadFeedbackDone(result))
]

// U P D A T E

export type Msg = utils.Msg<[Model], [Model, Cmd<Msg>]>

const LoadFeedback: Msg = {
  update(model: Model): [Model, Cmd<Msg>] {
    return [
      {
        ...model,
        feedback: RemoteData.Loading
      },
      api.getFeedbackList.send(result => LoadFeedbackDone(result))
    ]
  }
}

const LoadFeedbackDone = cons(
  class LoadFeedbackDone implements Msg {
    public constructor(
      private readonly result: Either<Http.Error, Array<api.Feedback>>
    ) {}

    public update(model: Model): [Model, Cmd<Msg>] {
      return [
        {
          ...model,
          feedback: RemoteData.fromEither(this.result)
        },
        Cmd.none
      ]
    }
  }
)

const FiltersMsg = cons(
  class FiltersMsg implements Msg {
    public constructor(private readonly msg: Filters.Msg) {}

    public update(model: Model): [Model, Cmd<Msg>] {
      return [
        {
          ...model,
          filters: this.msg.update(model.filters)
        },
        Cmd.none
      ]
    }
  }
)

// V I E W

const cssFilters = css`
  margin-bottom: 16px;

  @media ${breakpoints.big.minWidth} {
    margin-bottom: 28px;
  }
`

const StyledHttpFailureReport = styled(HttpFailureReport)`
  margin: 0 auto;
`

const ViewSucceed: FC<{
  feedback: Array<api.Feedback>
  filters: Filters.Model
  dispatch: Dispatch<Msg>
}> = React.memo(({ feedback, filters, dispatch }) => {
  const items = feedback.reduce<Array<[Array<utils.Fragment>, api.Feedback]>>(
    (acc, item) => {
      return Filters.toFragments(filters, item).fold(
        () => acc,
        fragments => {
          acc.push([fragments, item])

          return acc
        }
      )
    },
    []
  )

  return (
    <div data-cy="dashboard__root">
      <Filters.View
        className={cssFilters}
        model={filters}
        dispatch={msg => dispatch(FiltersMsg(msg))}
      />

      <FeedbackTable.View items={items} />
    </div>
  )
})

export const View: FC<{
  model: Model
  dispatch: Dispatch<Msg>
}> = React.memo(({ model, dispatch }) =>
  model.feedback.cata({
    Loading: () => <Skeleton />,

    Failure: error => (
      <StyledHttpFailureReport
        error={error}
        onTryAgain={() => dispatch(LoadFeedback)}
      />
    ),

    Succeed: feedback => (
      <ViewSucceed
        feedback={feedback}
        filters={model.filters}
        dispatch={dispatch}
      />
    )
  })
)

// H E A D E R

const StyledHeaderIcon = styled(TachometerIcon)`
  margin-right: 16px;
  width: 27px;
  height: 27px;
`

const StyledHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Header: FC = React.memo(() => (
  <StyledHeader>
    <StyledHeaderIcon /> Dashboard
  </StyledHeader>
))

// S K E L E T O N

const Skeleton: FC = React.memo(() => (
  <div data-cy="dashboard__skeleton">
    <Filters.Skeleton className={cssFilters} />

    <FeedbackTable.Skeleton count={20} />
  </div>
))
