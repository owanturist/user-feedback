import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion/macro'
import { Cmd } from 'frctl'

import { Dispatch } from 'Provider'
import * as breakpoints from 'breakpoints'
import * as api from 'api'
import * as Filters from 'Filters'
import * as FeedbackTable from 'FeedbackTable'
import * as utils from 'utils'
import { ReactComponent as TachometerIcon } from './tachometer.svg'

// M O D E L

export type Model = {
  filters: Filters.Model
}

export const initial: Model = {
  filters: Filters.initial
}

// U P D A T E

export type Msg = utils.Msg<[Model], [Model, Cmd<Msg>]>

const FiltersMsg = utils.cons(
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

const ViewRoot: FC = ({ children }) => (
  <StyledRoot data-cy="dashboard__root">
    <ViewHeader />

    <StyledScroller>
      <StyledContainer>{children}</StyledContainer>
    </StyledScroller>
  </StyledRoot>
)

export const View: FC<{
  feedback: Array<api.Feedback>
  model: Model
  dispatch: Dispatch<Msg>
}> = React.memo(({ feedback, model, dispatch }) => {
  const items = React.useMemo(
    () => feedback.filter(item => Filters.isPass(model.filters, item)),
    [feedback, model.filters]
  )

  return (
    <ViewRoot>
      <Filters.View
        className={cssFilters}
        model={model.filters}
        dispatch={React.useCallback(msg => dispatch(FiltersMsg(msg)), [
          dispatch
        ])}
      />

      <FeedbackTable.View items={items} />
    </ViewRoot>
  )
})

// S K E L E T O N

export const Skeleton: FC = React.memo(() => (
  <ViewRoot>
    <Filters.Skeleton className={cssFilters} />

    <FeedbackTable.Skeleton count={20} />
  </ViewRoot>
))
