export const SMALL = 560
export const BIG = 1024

export type Breakpoint = {
  minWidth: string
}

const makeBreakpoint = (width: number): Breakpoint => ({
  minWidth: `screen and (min-width: ${width + 1}px)`
})

export const small = makeBreakpoint(SMALL)
export const big = makeBreakpoint(BIG)

export default { small, big }
