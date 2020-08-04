import * as Counter from './index'

describe('Counter', () => {
  it('Msg.Decrement', () => {
    expect(
      Counter.Decrement.update({
        count: 0
      })
    ).toEqual({
      count: -1
    })
  })

  it('Msg.Increment', () => {
    expect(
      Counter.Increment.update({
        count: 0
      })
    ).toEqual({
      count: 1
    })
  })
})
