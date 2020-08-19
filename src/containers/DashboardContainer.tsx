import React from 'react'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { useSelector, useDispatch } from 'react-redux'
import { createAction, createReducer } from '@reduxjs/toolkit'

import { Rating, Feedback, getFeedbackList } from 'api'
import { Fragment, fragmentize } from 'utils'
import Screen from 'components/Screen'
import {
  Dashboard,
  FailureReport,
  DashboardSkeleton,
  DashboardHeader
} from 'components/Dashboard'

type Dispatch = ThunkDispatch<never, never, Action>

// S T A T E

export type State = {
  feedbackError: null | string
  feedbackData: null | Array<Feedback>
}

export const initial: State = {
  feedbackError: null,
  feedbackData: null
}

// A C T I O N S

const LoadFeedbackStart = createAction('Dashboard/LoadFeedback')
const LoadFeedbackFail = createAction<string>('Dashboard/LoadFeedbackFail')
const LoadFeedbackDone = createAction<Array<Feedback>>(
  'Dashboard/LoadFeedbackDone'
)

export const reducer = createReducer<State>(initial, builder => {
  return builder

    .addCase(LoadFeedbackStart, () => initial)

    .addCase(LoadFeedbackFail, (state, { payload: feedbackError }) => ({
      ...state,
      feedbackError
    }))

    .addCase(LoadFeedbackDone, (state, { payload: feedbackData }) => ({
      ...state,
      feedbackData
    }))
})

// E F F E C T S

const LoadFeedback = (dispatch: Dispatch): void => {
  getFeedbackList()
    .then(feedback => dispatch(LoadFeedbackDone(feedback)))
    .catch(error => dispatch(LoadFeedbackFail(error)))
}

const RetryLoadFeedback = (dispatch: Dispatch): void => {
  dispatch(LoadFeedbackStart)
  dispatch(LoadFeedback)
}

// V I E W

const filterMapFeedback = (
  searchPattern: string,
  excludeRatings: Record<number, boolean>,
  feedbackItems: Array<Feedback>
): Array<Feedback<Array<Fragment>>> => {
  const acc: Array<Feedback<Array<Fragment>>> = []

  for (const item of feedbackItems) {
    if (!excludeRatings[item.rating]) {
      const fragments = fragmentize(searchPattern, item.comment)

      if (fragments !== null) {
        acc.push({ ...item, comment: fragments })
      }
    }
  }

  return acc
}

const ViewFailureReport: React.FC<{
  error: any
}> = ({ error }) => {
  const dispatch: Dispatch = useDispatch()

  return (
    <FailureReport
      error={error}
      onTryAgain={() => dispatch(RetryLoadFeedback)}
    />
  )
}

const ViewDashboard: React.FC<{
  feedback: Array<Feedback>
}> = ({ feedback }) => {
  const [search, setSearch] = React.useState('')
  const [excludeRatings, setExcludeRatings] = React.useState<
    Record<number, boolean>
  >({})

  const items = React.useMemo(
    () => filterMapFeedback(search, excludeRatings, feedback),
    [excludeRatings, feedback, search]
  )

  const onToggleRating = React.useCallback(
    (rating: Rating) =>
      setExcludeRatings(ratings => ({
        ...ratings,
        [rating]: !ratings[rating]
      })),
    []
  )

  return (
    <Dashboard
      items={items}
      search={search}
      excludeRatings={excludeRatings}
      onSearchChange={setSearch}
      onToggleRating={onToggleRating}
    />
  )
}

const ViewContent: React.FC<{
  state: State
}> = ({ state }) => {
  const dispatch: Dispatch = useDispatch()

  React.useEffect(() => dispatch(LoadFeedback), [dispatch])

  if (state.feedbackError !== null) {
    return <ViewFailureReport error={state.feedbackError} />
  }

  if (state.feedbackData !== null) {
    return <ViewDashboard feedback={state.feedbackData} />
  }

  return <DashboardSkeleton />
}

const DashboardContainer: React.FC<{
  selector(glob: unknown): State
}> = ({ selector }) => (
  <Screen header={<DashboardHeader />}>
    <ViewContent state={useSelector(selector)} />
  </Screen>
)

export default DashboardContainer
