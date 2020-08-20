import React from 'react'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { useSelector, useDispatch } from 'react-redux'
import { createAction, createReducer } from '@reduxjs/toolkit'

import { ResponseError, FeedbackDetailed, getFeedbackById } from 'api'
import Page404 from 'components/Page404'
import {
  Details,
  DetailsFailureReport,
  DetailsSkeleton
} from 'components/Details'

type Dispatch = ThunkDispatch<never, never, Action>

// S T A T E

export type State = {
  detailedFeedbackError: null | ResponseError
  detailedFeedbackData: null | FeedbackDetailed
  notFound: boolean
}

export const initial: State = {
  detailedFeedbackError: null,
  detailedFeedbackData: null,
  notFound: false
}

// A C T I O N S

const LoadFeedbackStart = createAction('Details/LoadFeedbackStart')
const LoadFeedbackFail = createAction<string>('Details/LoadFeedbackFail')
const LoadFeedbackDone = createAction<null | FeedbackDetailed>(
  'Details/LoadFeedbackDone'
)

export const reducer = createReducer<State>(initial, builder => {
  builder
    .addCase(LoadFeedbackStart, () => initial)

    .addCase(LoadFeedbackFail, (state, { payload: detailedFeedbackError }) => ({
      ...state,
      detailedFeedbackError
    }))

    .addCase(LoadFeedbackDone, (state, { payload: detailedFeedbackData }) => ({
      ...state,
      detailedFeedbackData,
      notFound: detailedFeedbackData === null
    }))
})

// T H U N K S

const LoadFeedback = (feedbackId: string) => (dispatch: Dispatch): void => {
  dispatch(LoadFeedbackStart())

  getFeedbackById(feedbackId)
    .then(feedback => dispatch(LoadFeedbackDone(feedback)))
    .catch(error => dispatch(LoadFeedbackFail(error)))
}

// V I E W

const ViewFailureReport: React.FC<{
  feedbackId: string
  error: ResponseError
}> = ({ feedbackId, error }) => {
  const dispatch: Dispatch = useDispatch()

  return (
    <DetailsFailureReport
      error={error}
      onTryAgain={() => dispatch(LoadFeedback(feedbackId))}
    />
  )
}

const DetailsContainer: React.FC<{
  feedbackId: string
  selector(glob: unknown): State
}> = ({ feedbackId, selector }) => {
  const dispatch: Dispatch = useDispatch()

  React.useEffect(() => dispatch(LoadFeedback(feedbackId)), [
    dispatch,
    feedbackId
  ])

  const { detailedFeedbackError, detailedFeedbackData, notFound } = useSelector(
    selector
  )

  if (detailedFeedbackError !== null) {
    return (
      <ViewFailureReport
        feedbackId={feedbackId}
        error={detailedFeedbackError}
      />
    )
  }

  if (detailedFeedbackData !== null) {
    return <Details feedback={detailedFeedbackData} />
  }

  if (notFound) {
    return <Page404 />
  }

  return <DetailsSkeleton />
}

export default DetailsContainer
