export type Msg<A extends Array<unknown>, R> = {
  update(...args: A): R
}

export const inst = <T>(Constructor: new () => T): T => new Constructor()

export const cons = <A extends Array<unknown>, T>(
  Constructor: new (...args: A) => A extends [] ? never : T
) => (...args: A): T => new Constructor(...args)
