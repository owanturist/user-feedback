import React from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion/macro'

import { FeedbackDetailed } from 'api'
import Screen from 'components/Screen'
import { RatingMarkStatic, RatingMarkSkeleton } from 'components/RatingMark'
import HttpFailureReport, {
  HttpFailureReportProps
} from 'components/HttpFailureReport'
import { LayoutSkeleton } from './Layout'

const cssRating = css`
  margin-right: 10px;
`

const StyledHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Viewheader: React.FC = ({ children }) => (
  <StyledHeader>{children}Feedback Details</StyledHeader>
)

const ViewLazy = React.lazy(() => import('./View'))

export const Details: React.FC<{
  feedback: FeedbackDetailed
}> = React.memo(({ feedback }) => (
  <Screen
    header={
      <Viewheader>
        <RatingMarkStatic className={cssRating} rating={feedback.rating} />
      </Viewheader>
    }
  >
    <React.Suspense fallback={<LayoutSkeleton />}>
      <ViewLazy feedback={feedback} />
    </React.Suspense>
  </Screen>
))

// F A I L U R E   R E P O R T

const StyledFailureReport = styled(HttpFailureReport)`
  margin: 0 auto;
`

export const DetailsFailureReport: React.FC<HttpFailureReportProps> = props => (
  <Screen header={<Viewheader />}>
    <StyledFailureReport {...props} />
  </Screen>
)

// S K E L T O N

export const DetailsSkeleton: React.FC = () => (
  <Screen
    header={
      <Viewheader>
        <RatingMarkSkeleton className={cssRating} />
      </Viewheader>
    }
  >
    <LayoutSkeleton />
  </Screen>
)
