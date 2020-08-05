import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion/macro'
import { Cmd } from 'frctl'

import { Dispatch, composeDispatch } from 'Provider'
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

const cssFeedbackTable = css`
  margin-top: 25px;
`

const StyledContent = styled.div`
  box-sizing: border-box;
  margin: 30px auto 0;
  padding: 0 16px 16px;
  width: 100%;
  max-width: 1454px;
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
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  padding: 19px 10px;
  color: rgb(94, 98, 100);
  background: #fff;
  box-shadow: 0 0 2px 2px #dadee0;
  user-select: none;
`

const ViewHeader: FC = React.memo(() => (
  <StyledHeader>
    {/* @TODO Add svg icon */}
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
    <StyledRoot data-cy="dashboard__root">
      <ViewHeader />

      <StyledContent>
        <Filters.View
          model={model.filters}
          dispatch={composeDispatch(dispatch, FiltersMsg)}
        />

        <FeedbackTable.View className={cssFeedbackTable} items={items} />
      </StyledContent>
    </StyledRoot>
  )
})

// S K E L E T O N

export const Skeleton: FC = React.memo(() => (
  <StyledRoot data-cy="dashboard__skeleton">
    <ViewHeader />

    <StyledContent>
      <Filters.Skeleton />

      <FeedbackTable.Skeleton className={cssFeedbackTable} count={20} />
    </StyledContent>
  </StyledRoot>
))
