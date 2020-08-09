import Maybe from 'frctl/Maybe'

/**
 * Template to define message signature
 */
export type Msg<A extends Array<unknown>, R> = {
  update(...args: A): R
}

/**
 * Trimm a string and return Just<string> if not empty or Nothing otherwise
 *
 * @param str string to perform
 *
 * @example
 * nonEmptyString('') === Nothing
 * nonEmptyString('  ') === Nothing
 * nonEmptyString('  hi  ') === Just('hi')
 */
export const nonEmptyString = (str: string): Maybe<string> => {
  const trimmed = str.trim()

  return trimmed.length === 0 ? Maybe.Nothing : Maybe.Just(trimmed)
}

/**
 * Tricky helper to handle tricky Cata default '_' case.
 * In Cata we assume that default case is always present
 * in case of current is not provided.
 *
 * @param defaultFn usually '_' pattern case
 * @param fn target optional case
 * @param args arguments for optional case
 */
export const callOrElse = <A extends Array<unknown>, R>(
  defaultFn: (() => R) | undefined,
  fn: ((...args: A) => R) | undefined,
  ...args: A
): R => {
  return typeof fn === 'function' ? fn(...args) : (defaultFn as () => R)()
}

/**
 * Text fragment from fragmentize.
 * Represents a slice of text either matched or not with input.
 */
export type Fragment = {
  slice: string
  matched: boolean
}

const getLowChar = (index: number, input: string): string => {
  return input.charAt(index).toLowerCase()
}

/**
 * Split an input string to fragments according a pattern.
 * Takes time proportional to O(n) where n is length of input string.
 *
 * @param pattern
 * @param input
 */
export const fragmentize = (
  pattern: string,
  input: string
): Maybe<Array<Fragment>> => {
  const P = pattern.length
  const I = input.length

  // pattern is bigger - no match possible
  if (P > I) {
    return Maybe.Nothing
  }

  // input is empty - no fragments
  if (I === 0) {
    return Maybe.Just([])
  }

  // pattern is empty - everything is not matched
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
