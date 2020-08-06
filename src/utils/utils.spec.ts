import { fragmentize } from './index'

describe('fragmentize', () => {
  it('no fragments for empty pattern', () => {
    expect(fragmentize('', 'input')).toEqual([])
  })

  it('no fragments for empty input', () => {
    expect(fragmentize('pattern', '')).toEqual([])
  })

  it('no fragments for longer pattern', () => {
    expect(fragmentize('pattern pattern', 'pattern')).toEqual([])
  })

  it('single matched for equal input and pattern', () => {
    expect(fragmentize('input', 'input')).toEqual([
      {
        slice: 'input',
        matched: true
      }
    ])
  })

  it('pattern appers in very beggining', () => {
    expect(fragmentize('pattern', 'pattern no more')).toEqual([
      {
        slice: 'pattern',
        matched: true
      },
      {
        slice: ' no more',
        matched: false
      }
    ])
  })

  it('pattern appers in the end', () => {
    expect(fragmentize('pattern', 'no more pattern')).toEqual([
      {
        slice: 'no more ',
        matched: false
      },
      {
        slice: 'pattern',
        matched: true
      }
    ])
  })

  it('pattern appers in the middle', () => {
    expect(fragmentize('pattern', 'no pattern more')).toEqual([
      {
        slice: 'no ',
        matched: false
      },
      {
        slice: 'pattern',
        matched: true
      },
      {
        slice: ' more',
        matched: false
      }
    ])
  })

  it('pattern ignores cases', () => {
    expect(fragmentize('patTeRN', 'no PaTtern more')).toEqual([
      {
        slice: 'no ',
        matched: false
      },
      {
        slice: 'PaTtern',
        matched: true
      },
      {
        slice: ' more',
        matched: false
      }
    ])
  })

  it('pattern matches by fragments', () => {
    expect(fragmentize('pattern', '1p2a3t4t5e6r7n8')).toEqual([
      {
        slice: '1',
        matched: false
      },
      {
        slice: 'p',
        matched: true
      },
      {
        slice: '2',
        matched: false
      },
      {
        slice: 'a',
        matched: true
      },
      {
        slice: '3',
        matched: false
      },
      {
        slice: 't',
        matched: true
      },
      {
        slice: '4',
        matched: false
      },
      {
        slice: 't',
        matched: true
      },
      {
        slice: '5',
        matched: false
      },
      {
        slice: 'e',
        matched: true
      },
      {
        slice: '6',
        matched: false
      },
      {
        slice: 'r',
        matched: true
      },
      {
        slice: '7',
        matched: false
      },
      {
        slice: 'n',
        matched: true
      },
      {
        slice: '8',
        matched: false
      }
    ])
  })

  it('pattern matches the first appearance', () => {
    expect(fragmentize('pattern', 'hello papa what is the pattern?')).toEqual([
      {
        slice: 'hello ',
        matched: false
      },
      {
        slice: 'pa',
        matched: true
      },
      {
        slice: 'pa wha',
        matched: false
      },
      {
        slice: 't',
        matched: true
      },
      {
        slice: ' is ',
        matched: false
      },
      {
        slice: 't',
        matched: true
      },
      {
        slice: 'h',
        matched: false
      },
      {
        slice: 'e',
        matched: true
      },
      {
        slice: ' patte',
        matched: false
      },
      {
        slice: 'rn',
        matched: true
      },
      {
        slice: '?',
        matched: false
      }
    ])
  })
})
