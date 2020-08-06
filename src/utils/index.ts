import Maybe from 'frctl/Maybe'

export type Msg<A extends Array<unknown>, R> = {
  update(...args: A): R
}

export type Fragment = {
  slice: string
  matched: boolean
}

const getLowChar = (index: number, input: string): string => {
  return input.charAt(index).toLowerCase()
}

export const fragmentize = (
  pattern: string,
  input: string
): Maybe<Array<Fragment>> => {
  const P = pattern.length
  const I = input.length

  if (P > I) {
    return Maybe.Nothing
  }

  if (I === 0) {
    return Maybe.Just([])
  }

  if (P === 0) {
    return Maybe.Just([
      {
        slice: input,
        matched: false
      }
    ])
  }

  const fragments: Array<Fragment> = []
  let start = 0
  let i = 0
  let matched = getLowChar(0, pattern) === getLowChar(0, input)

  for (let p = 0; p < P; i++) {
    // eof but pattern not entirely matched
    if (i === I) {
      return Maybe.Nothing
    }

    const charMatched = getLowChar(p, pattern) === getLowChar(i, input)

    // if char is matched so test next pattern char
    p = charMatched ? p + 1 : p

    if (charMatched !== matched) {
      fragments.push({
        slice: input.slice(start, i),
        matched
      })

      start = i
      matched = !matched
    }
  }

  // add last matched fragment
  fragments.push({
    slice: input.slice(start, i),
    matched
  })

  // add unchecked fragment
  if (i < I) {
    fragments.push({
      slice: input.slice(i),
      matched: !matched
    })
  }

  return Maybe.Just(fragments)
}
