import Maybe from 'frctl/Maybe'

import { fragmentize } from './index'

describe('fragmentize', () => {
  it('emmpty array for empty pattern and input', () => {
    expect(fragmentize('', '')).toEqual(Maybe.Just([]))
  })

  it('single no matched fragment for empty pattern', () => {
    expect(fragmentize('', 'input')).toEqual(
      Maybe.Just([
        {
          slice: 'input',
          matched: false
        }
      ])
    )
  })

  it('Nothing for empty input', () => {
    expect(fragmentize('pattern', '')).toEqual(Maybe.Nothing)
  })

  it('Nothing for longer pattern', () => {
    expect(fragmentize('pattern pattern', 'pattern')).toEqual(Maybe.Nothing)
  })

  it('Nothing when partial matching', () => {
    expect(fragmentize('pattern', 'pat one more')).toEqual(Maybe.Nothing)
  })

  it('single matched for equal input and pattern', () => {
    expect(fragmentize('input', 'input')).toEqual(
      Maybe.Just([
        {
          slice: 'input',
          matched: true
        }
      ])
    )
  })

  it('pattern appers in very beggining', () => {
    expect(fragmentize('pattern', 'pattern no more')).toEqual(
      Maybe.Just([
        {
          slice: 'pattern',
          matched: true
        },
        {
          slice: ' no more',
          matched: false
        }
      ])
    )
  })

  it('pattern appers in the end', () => {
    expect(fragmentize('pattern', 'no more pattern')).toEqual(
      Maybe.Just([
        {
          slice: 'no more ',
          matched: false
        },
        {
          slice: 'pattern',
          matched: true
        }
      ])
    )
  })

  it('pattern appers in the middle', () => {
    expect(fragmentize('pattern', 'no pattern more')).toEqual(
      Maybe.Just([
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
    )
  })

  it('pattern ignores cases', () => {
    expect(fragmentize('patTeRN', 'no PaTtern more')).toEqual(
      Maybe.Just([
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
    )
  })

  it('pattern matches by fragments', () => {
    expect(fragmentize('pattern', '1p2a3t4t5e6r7n8')).toEqual(
      Maybe.Just([
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
    )
  })

  it('pattern matches the first appearance', () => {
    expect(fragmentize('pattern', 'hello papa what is the pattern?')).toEqual(
      Maybe.Just([
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
    )
  })
})