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
import * as Filters from 'Filters'
import * as FeedbackTable from 'FeedbackTable'
import HttpFailureReport from 'HttpFailureReport'
import { ReactComponent as TachometerIcon } from './tachometer.svg'

// M O D E L

export type Model = {
  feedback: RemoteData<Http.Error, Array<api.Feedback>>
  filters: Filters.Model
}

export const init: [Model, Cmd<Msg>] = [
  {
    feedback: RemoteData.Loading,
    filters: Filters.initial
  },
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
  margin: 16px 0;

  @media ${breakpoints.big.minWidth} {
    margin: 28px 0;
  }
`

const cssFeedbackTable = css`
  margin-bottom: 16px;
`

const StyledErrorReportContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  min-height: 100%;
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
    <>
      <Filters.View
        className={cssFilters}
        model={filters}
        dispatch={msg => dispatch(FiltersMsg(msg))}
      />

      <FeedbackTable.View className={cssFeedbackTable} items={items} />
    </>
  )
})

export const View: FC<{
  model: Model
  dispatch: Dispatch<Msg>
}> = React.memo(({ model, dispatch }) =>
  model.feedback.cata({
    Loading: () => <Skeleton />,

    Failure: error => (
      <StyledErrorReportContainer>
        <HttpFailureReport
          error={error}
          onTryAgain={() => dispatch(LoadFeedback)}
        />
      </StyledErrorReportContainer>
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

export const Header: FC = React.memo(() => (
  <>
    <StyledHeaderIcon /> Dashboard
  </>
))

// S K E L E T O N

const Skeleton: FC = React.memo(() => (
  <>
    <Filters.Skeleton className={cssFilters} />

    <FeedbackTable.Skeleton className={cssFeedbackTable} count={20} />
  </>
))
