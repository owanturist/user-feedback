import React, { FC } from 'react'
import { Cmd } from 'frctl'
import * as Http from 'frctl/Http'
import RemoteData from 'frctl/RemoteData'
import Either from 'frctl/Either'

import * as api from 'api'
import { Dispatch } from 'Provider'
import * as Dashboard from 'Dashboard'
import * as utils from 'utils'

// M O D E L

export type Model = {
  feedback: RemoteData<Http.Error, Array<api.Feedback>>
  dashboard: Dashboard.Model
}

export const init: [Model, Cmd<Msg>] = [
  {
    feedback: RemoteData.Loading,
    dashboard: Dashboard.initial
  },
  api.getFeedback.send(result => LoadFeedbackDone(result))
]

// U P D A T E

export type Msg = utils.Msg<[Model], [Model, Cmd<Msg>]>

const LoadFeedbackDone = utils.cons(
  class LoadFeedbackDone implements Msg {
    public constructor(
      private readonly result: Either<Http.Error, Array<api.Feedback>>
    ) {}

    public update(model: Model): [Model, Cmd<Msg>] {
      return [
        {
          ...model,
          feedback: RemoteData.fromEither(this.result)
        },
        Cmd.none
      ]
    }
  }
)

// V I E W

export const View: FC<{ model: Model; dispatch: Dispatch<Msg> }> = ({
  model,
  dispatch
}) =>
  model.feedback.cata({
    Loading: () => <Dashboard.Skeleton />,

    Failure: error => null,

    Succeed: feedback => (
      <Dashboard.View
        feedback={feedback}
        model={model.dashboard}
        dispatch={() => {
          /** */
        }}
      />
    )
  })
