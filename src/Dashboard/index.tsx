import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion/macro'
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

const cssFeedbackTable = css`
  margin-top: 25px;
`

const StyledContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1422px;
`

const StyledHeaderContainer = styled(StyledContainer)`
  display: flex;
  justify-content: flex-end;
`

const StyledScroll = styled.div`
  position: relative; /* allows query offsetTop realtive the element */
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 30px 16px 16px;
`

const StyledIcon = styled(TachometerIcon)`
  width: 27px;
`

const StyledPageTitle = styled.h1`
  margin: 0 0 0 16px;
  font-weight: 600;
  font-size: 26px;
  letter-spacing: 0.02em;
`

type StyledHeaderProps = { shift: boolean }

const StyledMovableHeader = styled.div<StyledHeaderProps>`
  display: flex;
  flex-flow: row nowrap;
  margin-right: ${props => (props.shift ? 0 : 50)}%;
  transform: translate3d(${props => (props.shift ? 0 : 50)}%, 0, 0);
  transition: all 0.6s ease-in-out;
`

const StyledHeader = styled.header<StyledHeaderProps>`
  box-sizing: border-box;
  position: relative; /* shadow overflow of content */
  z-index: 2;
  padding: 19px 16px;
  color: rgb(94, 98, 100);
  background: #fff;
  box-shadow: 0 0 ${props => (props.shift ? '8px 4px' : '2px 2px')} #dadee0;
  transition: box-shadow 0.4s ease;
  user-select: none;
`

const ViewHeader: FC<{ shift: boolean }> = React.memo(({ shift }) => (
  <StyledHeader shift={shift}>
    <StyledHeaderContainer>
      <StyledMovableHeader shift={shift}>
        <StyledIcon />
        <StyledPageTitle>Dashboard</StyledPageTitle>
      </StyledMovableHeader>
    </StyledHeaderContainer>
  </StyledHeader>
))

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const ViewRoot: FC<{ filtersRef: React.RefObject<HTMLDivElement> }> = ({
  filtersRef,
  children
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = React.useState(false)

  const toggleScrolled = React.useCallback(
    (scrollTop: number, node: HTMLDivElement): void => {
      if (node.offsetTop + node.scrollHeight < scrollTop !== scrolled) {
        setScrolled(!scrolled)
      }
    },
    [scrolled]
  )

  React.useEffect(() => {
    if (containerRef.current && filtersRef.current) {
      toggleScrolled(containerRef.current.scrollTop, filtersRef.current)
    }
  })

  return (
    <StyledRoot data-cy="dashboard__root">
      <ViewHeader shift={scrolled} />

      <StyledScroll
        ref={containerRef}
        onScroll={event =>
          filtersRef.current &&
          toggleScrolled(event.currentTarget.scrollTop, filtersRef.current)
        }
      >
        <StyledContainer>{children}</StyledContainer>
      </StyledScroll>
    </StyledRoot>
  )
}

export const View: FC<{
  feedback: Array<api.Feedback>
  model: Model
  dispatch: Dispatch<Msg>
}> = React.memo(({ feedback, model, dispatch }) => {
  const filtersRef = React.useRef<HTMLDivElement>(null)

  const items = React.useMemo(
    () => feedback.filter(item => Filters.isPass(model.filters, item)),
    [feedback, model.filters]
  )

  return (
    <ViewRoot filtersRef={filtersRef}>
      <Filters.View
        ref={filtersRef}
        model={model.filters}
        dispatch={React.useCallback(msg => dispatch(FiltersMsg(msg)), [
          dispatch
        ])}
      />

      <FeedbackTable.View className={cssFeedbackTable} items={items} />
    </ViewRoot>
  )
})

// S K E L E T O N

export const Skeleton: FC = React.memo(() => {
  const filtersRef = React.useRef<HTMLDivElement>(null)

  return (
    <ViewRoot filtersRef={filtersRef}>
      <Filters.Skeleton ref={filtersRef} />

      <FeedbackTable.Skeleton className={cssFeedbackTable} count={20} />
    </ViewRoot>
  )
})
