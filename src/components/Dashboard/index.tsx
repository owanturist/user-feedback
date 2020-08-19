import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion/macro'

import * as breakpoints from 'breakpoints'
import { Rating } from 'api'
import { Filters, FiltersSkeleton } from 'components/Filters'
import {
  FeedbackTable,
  FeedbackTableSkeleton,
  FeedbackTableItem
} from 'components/FeedbackTable'
import HttpFailureReport from 'components/HttpFailureReport'
import { ReactComponent as TachometerIcon } from './tachometer.svg'

const cssFilters = css`
  margin-bottom: 16px;

  @media ${breakpoints.big.minWidth} {
    margin-bottom: 28px;
  }
`

export const Dashboard: FC<{
  items: Array<FeedbackTableItem>
  search: string
  excludeRatings: Record<number, boolean>
  onSearchChange(search: string): void
  onToggleRating(rating: Rating): void
}> = React.memo(
  ({ items, search, excludeRatings, onSearchChange, onToggleRating }) => (
    <div data-cy="dashboard__root">
      <Filters
        className={cssFilters}
        search={search}
        excludeRatings={excludeRatings}
        onSearchChange={onSearchChange}
        onToggleRating={onToggleRating}
      />

      <FeedbackTable items={items} />
    </div>
  )
)

// F A I L U R E   R E P O R T

export const FailureReport = styled(HttpFailureReport)`
  margin: 0 auto;
`

// S K E L E T O N

export const DashboardSkeleton: FC = React.memo(() => (
  <div data-cy="dashboard__skeleton">
    <FiltersSkeleton className={cssFilters} />

    <FeedbackTableSkeleton count={20} />
  </div>
))

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

export const DashboardHeader: FC = React.memo(() => (
  <StyledHeader>
    <StyledHeaderIcon /> Dashboard
  </StyledHeader>
))
