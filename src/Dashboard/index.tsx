import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import { Cmd } from 'frctl'

import { Dispatch } from 'Provider'
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

const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  width: 100%;
  max-width: 1422px;
`

const StyledFiltersContainer = styled(StyledContainer)`
  /* position: fixed; */
  /* top: 0;
  right: 0;
  bottom: 0;
  left: 0; */
  position: sticky;
  z-index: 2;
  top: -36px;
  margin-bottom: 16px;

  @media (min-width: 520px) {
    top: 14px;
  }

  @media (min-width: 769px) {
    top: 14px;
    margin-bottom: 25px;
  }
`

const StyledContentContainer = styled(StyledContainer)`
  display: flex;
  flex-direction: column;
  padding: 16px;

  @media (min-width: 769px) {
    padding-top: 30px;
  }
`

const StyledHeaderContainer = styled(StyledContainer)`
  display: flex;
  justify-content: center;

  @media (min-width: 769px) {
    justify-content: flex-end;
  }

  @media (min-width: 1335px) {
    justify-content: center;
  }
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
  position: sticky; /* shadow overflow of content */
  top: 0;
  z-index: 2;
  padding: 19px 16px;
  color: rgb(94, 98, 100);
  background: #fff;
  box-shadow: 0 0 2px 2px #dadee0;
  transition: box-shadow 0.4s ease;
  user-select: none;
`

const ViewHeader: FC = React.memo(() => (
  <StyledHeader>
    <StyledHeaderContainer>
      <StyledIcon />
      <StyledPageTitle>Dashboard</StyledPageTitle>
    </StyledHeaderContainer>
  </StyledHeader>
))

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ViewRoot: FC = ({ children }) => (
  <StyledRoot data-cy="dashboard__root">
    <ViewHeader />

    <StyledContentContainer>{children}</StyledContentContainer>
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
      <StyledFiltersContainer>
        <Filters.View
          model={model.filters}
          dispatch={React.useCallback(msg => dispatch(FiltersMsg(msg)), [
            dispatch
          ])}
        />
      </StyledFiltersContainer>

      <FeedbackTable.View items={items} />
    </ViewRoot>
  )
})

// S K E L E T O N

export const Skeleton: FC = React.memo(() => (
  <ViewRoot>
    <StyledFiltersContainer>
      <Filters.Skeleton />
    </StyledFiltersContainer>

    <FeedbackTable.Skeleton count={20} />
  </ViewRoot>
))
