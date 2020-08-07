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
  api.getFeedback.send(result => LoadFeedbackDone(result))
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
      api.getFeedback.send(result => LoadFeedbackDone(result))
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

const StyledContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 16px;
  width: 100%;
  max-width: 1454px;

  @media ${breakpoints.big.minWidth} {
    padding-top: 28px;
  }
`

const StyledScroller = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  scroll-behavior: smooth;
`

const StyledIcon = styled(TachometerIcon)`
  width: 27px;
  height: 27px;
`

const StyledPageTitle = styled.h1`
  margin: 0 0 0 16px;
  font-weight: 600;
  font-size: 26px;
  letter-spacing: 0.02em;
`

const StyledHeader = styled.header`
  box-sizing: border-box;
  position: relative; /* shadow overflow of content */
  z-index: 2;
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 19px 16px;
  color: rgb(94, 98, 100);
  background: #fff;
  box-shadow: 0 0 2px 2px #dadee0;
  transition: box-shadow 0.4s ease;
  user-select: none;
`

const ViewHeader: FC = React.memo(() => (
  <StyledHeader>
    <StyledIcon />
    <StyledPageTitle>Dashboard</StyledPageTitle>
  </StyledHeader>
))

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const ViewRoot: FC = ({ children, ...props }) => (
  <StyledRoot {...props}>
    <ViewHeader />

    <StyledScroller>
      <StyledContainer>{children}</StyledContainer>
    </StyledScroller>
  </StyledRoot>
)

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
    <ViewRoot data-cy="dashboard__root">
      <Filters.View
        className={cssFilters}
        model={filters}
        dispatch={msg => dispatch(FiltersMsg(msg))}
      />

      <FeedbackTable.View items={items} />
    </ViewRoot>
  )
})

export const View: FC<{
  model: Model
  dispatch: Dispatch<Msg>
}> = React.memo(({ model, dispatch }) =>
  model.feedback.cata({
    Loading: () => <Skeleton />,

    Failure: error => (
      <HttpFailureReport
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

// S K E L E T O N

const Skeleton: FC = React.memo(() => (
  <ViewRoot data-cy="dashboard__skeleton">
    <Filters.Skeleton className={cssFilters} />

    <FeedbackTable.Skeleton count={20} />
  </ViewRoot>
))
