import { combineReducers } from '@reduxjs/toolkit'

import {
  State as DashboardState,
  reducer as dashboardReducer
} from 'containers/DashboardContainer'
import {
  State as DetailsState,
  reducer as detailsReducer
} from 'containers/DetailsContainer'

export type State = {
  dashboard: DashboardState
  details: DetailsState
}

export const reducer = combineReducers<State>({
  dashboard: dashboardReducer,
  details: detailsReducer
})

export const selectDashboard = (state: State): DashboardState => state.dashboard

export const selectDetails = (state: State): DetailsState => state.details
