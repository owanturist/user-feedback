import React, { FC } from 'react'

import { Dispatch } from 'Provider'
import * as Counter from 'Counter'
import * as utils from 'utils'

// M O D E L

export type Model = {
  firstCounter: Counter.Model
  secondCounter: Counter.Model
}

export const initial: Model = {
  firstCounter: Counter.initial,
  secondCounter: Counter.initial
}

// U P D A T E

export type Msg = utils.Msg<[Model], Model>

const FirstCounter = utils.cons(
  class FirstCounter implements Msg {
    public constructor(private readonly msg: Counter.Msg) {}

    public update(model: Model): Model {
      return {
        ...model,
        firstCounter: this.msg.update(model.firstCounter)
      }
    }
  }
)

const SecondCounter = utils.cons(
  class SecondCounter implements Msg {
    public constructor(private readonly msg: Counter.Msg) {}

    public update(model: Model): Model {
      return {
        ...model,
        secondCounter: this.msg.update(model.secondCounter)
      }
    }
  }
)

// V I E W

export const View: FC<{ model: Model; dispatch: Dispatch<Msg> }> = ({
  model,
  dispatch
}) => (
  <div>
    <Counter.View
      model={model.firstCounter}
      dispatch={msg => dispatch(FirstCounter(msg))}
    />
    <Counter.View
      model={model.secondCounter}
      dispatch={msg => dispatch(SecondCounter(msg))}
    />
  </div>
)
