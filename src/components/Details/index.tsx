import React from 'react'

// import React, { FC, Suspense } from 'react'
// import styled from '@emotion/styled/macro'
// import { css } from 'emotion/macro'
// import { Cmd } from 'frctl'
// import { cons } from 'frctl/Basics'
// import * as Http from 'frctl/Http'
// import Maybe from 'frctl/Maybe'
// import Either from 'frctl/Either'
// import RemoteData from 'frctl/RemoteData/Optional'

// import * as api from 'api'
// import * as utils from 'utils'
// import * as Rating from 'components/Rating'
// import * as Page404 from 'components/Page404'
// import HttpFailureReport from 'components/HttpFailureReport'
// import { Dispatch } from 'Provider'
// import { Skeleton } from './Layout'

// // M O D E L

// export type Model = {
//   feedback: RemoteData<Http.Error, api.FeedbackDetailed>
// }

// export const initial: Model = {
//   feedback: RemoteData.Loading
// }

// export const init = (feedbackId: string): [Model, Cmd<Msg>] => [
//   initial,
//   api.getFeedbackById(feedbackId).send(result => LoadFeedbackDone(result))
// ]

// // U P D A T E

// export type Msg = utils.Msg<[Model], [Model, Cmd<Msg>]>

// const LoadFeedback = cons(
//   class LoadFeedback implements Msg {
//     public constructor(private readonly feedbackId: string) {}

//     public update(model: Model): [Model, Cmd<Msg>] {
//       return [
//         {
//           ...model,
//           feedback: RemoteData.Loading
//         },
//         api
//           .getFeedbackById(this.feedbackId)
//           .send(result => LoadFeedbackDone(result))
//       ]
//     }
//   }
// )

// const LoadFeedbackDone = cons(
//   class LoadFeedbackDone implements Msg {
//     public constructor(
//       private readonly result: Either<Http.Error, Maybe<api.FeedbackDetailed>>
//     ) {}

//     public update(model: Model): [Model, Cmd<Msg>] {
//       return [
//         {
//           ...model,
//           feedback: this.result.cata<
//             RemoteData<Http.Error, api.FeedbackDetailed>
//           >({
//             Left: RemoteData.Failure,
//             Right: feedback =>
//               feedback.cata({
//                 Nothing: () => RemoteData.NotAsked,
//                 Just: RemoteData.Succeed
//               })
//           })
//         },
//         Cmd.none
//       ]
//     }
//   }
// )

// // V I E W

// const StyledHttpFailureReport = styled(HttpFailureReport)`
//   margin: 0 auto;
// `

// const ViewSucceed = React.lazy(() => import('./View'))

// export const View: FC<{
//   feedbackId: string
//   model: Model
//   dispatch: Dispatch<Msg>
// }> = ({ feedbackId, model, dispatch }) =>
//   model.feedback.cata({
//     NotAsked: () => <Page404.View />,

//     Loading: () => <Skeleton />,

//     Failure: error => (
//       <StyledHttpFailureReport
//         error={error}
//         onTryAgain={() => dispatch(LoadFeedback(feedbackId))}
//       />
//     ),

//     Succeed: feedback => (
//       <Suspense fallback={<Skeleton />}>
//         <ViewSucceed feedback={feedback} />
//       </Suspense>
//     )
//   })

// // H E A D E R

// const cssRating = css`
//   margin-right: 10px;
// `

// const StyledHeader = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `

// export const Header: FC<{ model: Model }> = React.memo(({ model }) =>
//   model.feedback.cata({
//     NotAsked: () => <Page404.Header />,

//     Loading: () => (
//       <StyledHeader>
//         <Rating.Skeleton className={cssRating} /> Feedback Details
//       </StyledHeader>
//     ),

//     Failure: () => <StyledHeader>Feedback Details</StyledHeader>,

//     Succeed: ({ rating }) => (
//       <StyledHeader>
//         <Rating.Static className={cssRating} rating={rating} /> Feedback Details
//       </StyledHeader>
//     )
//   })
// )

const Details: React.FC = () => null

export default Details
