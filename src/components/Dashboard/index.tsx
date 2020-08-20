import React from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion/macro'

import * as breakpoints from 'breakpoints'
import { Rating } from 'api'
import Screen, { ScreenProps } from 'components/Screen'
import { Filters, FiltersSkeleton } from 'components/Filters'
import {
  FeedbackTable,
  FeedbackTableSkeleton,
  FeedbackTableItem
} from 'components/FeedbackTable'
import HttpFailureReport, {
  HttpFailureReportProps
} from 'components/HttpFailureReport'
import { ReactComponent as TachometerIcon } from './tachometer.svg'

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

const ViewScreen: React.FC<Omit<ScreenProps, 'header'>> = props => (
  <Screen
    header={
      <StyledHeader>
        <StyledHeaderIcon /> Dashboard
      </StyledHeader>
    }
    {...props}
  />
)

const cssFilters = css`
  margin-bottom: 16px;

  @media ${breakpoints.big.minWidth} {
    margin-bottom: 28px;
  }
`

export const Dashboard: React.FC<{
  items: Array<FeedbackTableItem>
  search: string
  excludeRatings: Record<number, boolean>
  onSearchChange(search: string): void
  onToggleRating(rating: Rating): void
}> = React.memo(
  ({ items, search, excludeRatings, onSearchChange, onToggleRating }) => (
    <ViewScreen data-cy="dashboard__root">
      <Filters
        className={cssFilters}
        search={search}
        excludeRatings={excludeRatings}
        onSearchChange={onSearchChange}
        onToggleRating={onToggleRating}
      />

      <FeedbackTable items={items} />
    </ViewScreen>
  )
)

// F A I L U R E   R E P O R T

const StyledFailureReport = styled(HttpFailureReport)`
  margin: 0 auto;
`

export const DashboardFailureReport: React.FC<HttpFailureReportProps> = props => (
  <ViewScreen>
    <StyledFailureReport {...props} />
  </ViewScreen>
)

// S K E L E T O N

export const DashboardSkeleton: React.FC = React.memo(() => (
  <ViewScreen data-cy="dashboard__skeleton">
    <FiltersSkeleton className={cssFilters} />

    <FeedbackTableSkeleton count={20} />
  </ViewScreen>
))
