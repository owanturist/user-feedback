import { combineReducers } from '@reduxjs/toolkit'

import {
  State as DashboardState,
  reducer as dashboardReducer
} from 'containers/DashboardContainer'

export type State = {
  dashboard: DashboardState
}

export const reducer = combineReducers<State>({
  dashboard: dashboardReducer
})
