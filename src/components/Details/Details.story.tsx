// import React, { FC } from 'react'
// import dayjs from 'dayjs'
// import { text, date, number } from '@storybook/addon-knobs'
// import { action } from '@storybook/addon-actions'

// import * as Http from 'frctl/Http'
// import RemoteData from 'frctl/RemoteData/Optional'
// import { nonEmptyString } from 'utils'
// import * as api from 'api'
// import * as Details from './index'

// const rangeKnob = (label: string, max: number, start: number): number =>
//   number(label, start, { range: true, min: 0, max, step: 1 })

// const viewportKnob = (viewport: api.Viewport): api.Viewport => ({
//   width: rangeKnob(`Viewport Width`, 5000, viewport.width),
//   height: rangeKnob(`Viewport Height`, 3000, viewport.height)
// })

// const screenKnob = (screen: api.Screen): api.Screen => ({
//   availableWidth: rangeKnob(`Screen Width`, 5000, screen.availableWidth),
//   availableHeight: rangeKnob(`Screen Height`, 3000, screen.availableHeight),
//   availableLeft: rangeKnob(`Screen Left`, 1000, screen.availableLeft),
//   availableTop: rangeKnob(`Screen Top`, 500, screen.availableTop)
// })

// const lngLatKnob = (label: string, lng: number, lat: number): api.LngLat => [
//   number(`${label} Lng`, lng, {
//     min: -180,
//     max: 180,
//     step: 0.01
//   }),
//   number(`${label} Lat`, lat, {
//     min: -90,
//     max: 90,
//     step: 0.01
//   })
// ]

// const feedbackKnob = (): api.FeedbackDetailed => ({
//   id: '0',
//   rating: number('Rating', 2, {
//     range: true,
//     min: 1,
//     max: 5,
//     step: 1
//   }),
//   comment: text('Comment', 'belle offre de services'),
//   browser: {
//     name: text('Browser Name', 'Chrome'),
//     version: text('Browser Version', '32.0'),
//     device: text('Browser Device', 'Desktop'),
//     platform: text('Browser Platform', 'MacOSX')
//   },

//   // detailed
//   email: nonEmptyString(text('Email', 'test@mail.com')),
//   url: text('Url', 'https://google.com'),
//   creationDate: dayjs(date('Creation Date', new Date(2020, 7, 7, 11, 48))),
//   viewport: viewportKnob({
//     width: 1583,
//     height: 865
//   }),
//   screen: screenKnob({
//     availableWidth: 1440,
//     availableHeight: 874,
//     availableTop: 22,
//     availableLeft: 0
//   }),
//   geo: {
//     country: text('Geo Country', 'FR'),
//     city: text('Geo City', 'Paris'),
//     position: lngLatKnob('Geo Position', 2.3333, 48.8667)
//   }
// })

// export default {
//   title: 'Details',
//   component: Details.View
// }

// export const HeaderLoading: FC = () => (
//   <Details.Header model={Details.initial} />
// )

// export const HeaderFailure: FC = () => (
//   <Details.Header
//     model={{
//       ...Details.initial,
//       feedback: RemoteData.Failure(Http.Error.Timeout)
//     }}
//   />
// )

// export const HeaderSucceed: FC = () => (
//   <Details.Header
//     model={{
//       ...Details.initial,
//       feedback: RemoteData.Succeed(feedbackKnob())
//     }}
//   />
// )

// export const Loading: FC = () => (
//   <Details.View
//     feedbackId={text('Feedback ID', 'some_id')}
//     model={Details.initial}
//     dispatch={action('dispatch')}
//   />
// )

// export const NotFound: FC = () => (
//   <Details.View
//     feedbackId={text('Feedback ID', 'some_id')}
//     model={{
//       ...Details.initial,
//       feedback: RemoteData.NotAsked
//     }}
//     dispatch={action('dispatch')}
//   />
// )

// export const Failure: FC = () => (
//   <Details.View
//     feedbackId={text('Feedback ID', 'some_id')}
//     model={{
//       ...Details.initial,
//       feedback: RemoteData.Failure(Http.Error.Timeout)
//     }}
//     dispatch={action('dispatch')}
//   />
// )

// export const Succeed: FC = () => (
//   <Details.View
//     feedbackId={text('Feedback ID', 'some_id')}
//     model={{
//       ...Details.initial,
//       feedback: RemoteData.Succeed(feedbackKnob())
//     }}
//     dispatch={action('dispatch')}
//   />
// )
