import React, { FC } from 'react'

import { Dispatch } from 'Provider'
import * as utils from 'utils'

// M O D E L

export type Model = {
  count: number
}

export const initial: Model = {
  count: 0
}

// U P D A T E

export type Msg = utils.Msg<[Model], Model>

export const Decrement: Msg = {
  update(model: Model): Model {
    return {
      ...model,
      count: model.count - 1
    }
  }
}

export const Increment: Msg = {
  update(model: Model): Model {
    return {
      ...model,
      count: model.count + 1
    }
  }
}

// V I E W

export const View: FC<{ model: Model; dispatch: Dispatch<Msg> }> = ({
  model,
  dispatch
}) => (
  <div>
    <button type="button" onClick={() => dispatch(Decrement)}>
      -
    </button>

    {model.count}

    <button type="button" onClick={() => dispatch(Increment)}>
      +
    </button>
  </div>
)

View.displayName = 'Counter'
