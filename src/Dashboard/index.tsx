import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion/macro'
import { Cmd } from 'frctl'

import { Dispatch, memoWithDispatch } from 'Provider'
import * as api from 'api'
import * as Filters from 'Filters'
import * as FeedbackTable from 'FeedbackTable'
import * as utils from 'utils'

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

const StyledIcon = styled.span`
  position: relative;
  box-sizing: border-box;
  border: 3px solid;
  border-radius: 50%;
  width: 27px;
  height: 27px;

  &::before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 4px;
    left: 0;
    margin: auto;
    width: 0;
    height: 0;
    border-width: 0 2px 10px;
    border-style: solid;
    border-color: transparent transparent currentColor;
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    right: 0;
    left: 0;
    margin: auto;
    border-radius: 50%;
    width: 3px;
    height: 3px;
    background: currentColor;
    box-shadow: -5px 2px 0 0 currentColor, 5px 2px 0 0 currentColor;
  }
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
}> = memoWithDispatch(({ feedback, model, dispatch }) => {
  const items = React.useMemo(
    () => feedback.filter(item => Filters.isPass(model.filters, item)),
    [feedback, model.filters]
  )

  return (
    <StyledRoot>
      <ViewHeader />

      <StyledContent>
        <Filters.View
          model={model.filters}
          dispatch={msg => dispatch(FiltersMsg(msg))}
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
