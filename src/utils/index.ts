export type Msg<A extends Array<unknown>, R> = {
  update(...args: A): R
}

export const inst = <T>(Constructor: new () => T): T => new Constructor()

export const cons = <A extends Array<unknown>, T>(
  Constructor: new (...args: A) => A extends [] ? never : T
) => (...args: A): T => new Constructor(...args)

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
): Array<Fragment> => {
  const P = pattern.length
  const I = input.length

  if (I === 0 || P === 0 || P > I) {
    return []
  }

  const fragments: Array<Fragment> = []
  let start = 0
  let matched = getLowChar(0, pattern) === getLowChar(0, input)

  for (let p = 0, i = 0; i < I; i++) {
    const charMatched = getLowChar(p, pattern) === getLowChar(i, input)

    if (charMatched !== matched) {
      fragments.push({
        slice: input.slice(start, i),
        matched
      })

      start = i
      matched = !matched
    }

    // if char is matched so test next pattern char
    p = charMatched ? p + 1 : p

    if (p === P) {
      // save fragment as if it sends in a middle
      if (i + 1 < I) {
        fragments.push({
          slice: input.slice(start, i + 1),
          matched
        })

        start = i + 1
        matched = !matched
      }

      break
    }
  }

  fragments.push({
    slice: input.slice(start),
    matched
  })

  return fragments
}
