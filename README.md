# User Feedback | [Demo](https://bit.ly/user-feedback-app) | [Storybook](https://bit.ly/user-feedback-ui)

_This project was bootstrapped with [Create React App][cra]._

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

### `yarn lint`

Runs [ESLint][eslint] for every TypeScript and JavaScript file including TSX/JSX.<br />
Prompts lint warnings and errors to console.

### `yarn prettify`

Runs [Prettier][prettier] for everything.

### `yarn analyze`

Runs [source-map-explorer][sme] on `build` folder.<br />
It shows you a treemap visualization to help you debug where all the code is coming from.

### `yarn storybook`

Runs [Storybook][storybook] sandbox.<br />
Open [http://localhost:9009](http://localhost:9009) to view it in the browser.

The page will reload if you make edits

### `yarn storybook:build`

Builds the storybook sandbox for deploy to the `storybook-static` folder.

### [`yarn cy:open`](https://docs.cypress.io/guides/guides/command-line.html#cypress-open)

Opens the [Cypress][cypress] Test Runner.

### [`yarn cy:run`](https://docs.cypress.io/guides/guides/command-line.html#cypress-run)

Runs Cypress tests to completion.

## Tech Stack

- [TypeScript][ts]
- [Webpack](https://webpack.js.org/) configured via [Create React App][cra]
- Code linting with [ESLint][eslint] and [Prettier][prettier]
- Isolated React component development environment with [Storybook][storybook]
- Functional tests with [Cypress][cypress]
- Unit tests with [Jest][jest]
- Bundle analyser [source-map-explorer][sme] to keep the size
- Prepush/commit hooks with [husky][husky]
- Layout with [React][react]
- State management with [Fractal][fractal]
- CSS-in-JS via [Emotion][emotion]

## Features

- [x] responsible layout
- [x] greedy search to filter feedback by comment
- [x] uses [`Json/Decode`](https://github.com/owanturist/Fractal/tree/master/src/Json/Decode) to validate and transform an api response. See handling of a decode error in [ action](https://bit.ly/user-feedback-app-error)
- [x] client side routing
- [x] nice [detailed feedback](https://bit.ly/user-feedback-app-details) page
- [x] 404 page
- [ ] save and restore filters to url query

## Why classes?

Here is a piece of code which describes simple counter's `Action` and way of handling them like `update`/`reducer`. Below the code you might find a lists of pros and cons by my opinion. I didn't use `readonly` for keep the example more clean.

```ts
/**
 * Common State.
 */
export interface State {
  count: number
}

/* REDUX WAY */

/**
 * Action definition.
 *
 * Everyone outside knows about signature of your Action
 * and might use it and violates encapsulation.
 */
export type Action =
  | { type: Decrement; amount: number }
  | { type: Increment; amount: number }
  | { type: Reset }

/**
 * Action.type definition.
 *
 * Used in Action definition and Action.type shortcut.
 * Not required.
 */
type Decrement = '@Counter/Decrement'

/**
 * Action.type shortcut.
 *
 * Used in Action shortcut and reducer.
 * Not required.
 */
const Decrement: Decrement = '@Counter/Decrement'

/**
 * Action shortcut.
 *
 * Used like constructor of Action wherever and whenever you need.
 * Not required.
 */
const decrement = (amount: number): Action => ({ type: Decrement, amount })

type Increment = '@Counter/Increment'
const Increment: Increment = '@Counter/Increment'
const increment = (amount: number): Action => ({ type: Increment, amount })

type Reset = '@Counter/Reset'
const Reset: Reset = '@Counter/Reset'
const reset: Action = { type: Reset }

/**
 * Handler of Action (reducer).
 *
 * Handles a whole bunch of Action.
 * This function always uses all cases of Action, so you should keep in mind
 * which of them the app really uses and which are legacy and should be removed.
 * Tree shaking keeps the code in place.
 */
export const update = (state: State, action: Action): State => {
  switch (action.type) {
    case Decrement: {
      return { ...state, count: state.count + action.amount }
    }

    case Increment: {
      return { ...state, count: state.count + action.amount }
    }

    case Reset: {
      return { ...state, count: 0 }
    }

    default: {
      return state
    }
  }
}

/* CLASS WAY */

/**
 * Action interface.
 *
 * Nobody outisde knows about signature of exact Action. Even inside the module.
 */
export interface Action {
  /**
   * Handler of Action.
   *
   * Handles just the Action and nothing else.
   */
  update(state: State): State
}

class Increment implements Action {
  constructor(private amount: number) {}

  public update(state: State): State {
    return { ...state, count: state.count + this.amount }
  }
}

class Decrement implements Action {
  constructor(private amount: number) {}

  public update(state: State): State {
    return { ...state, count: state.count - this.amount }
  }
}

const Reset: Action = {
  update(state: State): State {
    return { ...state, count: 0 }
  }
}
```

### Advantages

1. Encapsulation. No one parent module know anything about `Action`, it can just call `update`. It prevents modifying and reading of a `Action` from parent module.
1. No more huge `reducer` function - whole logic is described inside the source. It's very natural to define a `Action` and describe handling right there.
1. Easy track of unused `Action`. Otherwise you use described `type Action` at least in one place: `reducer`.
   Even if it uses only one of dozen `Actions` a modules' `reducer` will always use all of them.
1. More easy refactoring. Everything (definition, handling, helpers as static methods) in a single place and if you've decided to get rid of one of the `Action` you just delete it. Otherwise you should delete it at least from two places: type definition and `reducer`.

### Disadvantages

1. You should implement `update` method in every `Action`, so it looks like kind of boilerplate.
   Otherwise you have single place (`reducer`) which describes the signature.
1. Creating of `Action` with `new` looks unusual and not natural.

### Get rid of the `new`

To made the approach more "natural" the class example could be rewriten like that:

```ts
import { cons } from 'frctl/Basics'

export interface State {
  count: number
}

export interface Action {
  update(state: State): State
}

const Increment = cons(
  class implements Action {
    constructor(private amount: number) {}

    public update(state: State): State {
      return { ...state, count: state.count + this.amount }
    }
  }
)

const Decrement = cons(
  class implements Action {
    constructor(private amount: number) {}

    public update(state: State): State {
      return { ...state, count: state.count - this.amount }
    }
  }
)

const Reset: Action = {
  update(state: State): State {
    return { ...state, count: 0 }
  }
}
```

With `cons` (stands for constructor, at least one argument exists) you could use the action in a way `dispatch(Increment(1))` instead of `dispatch(new Increment(1))`.

[cra]: https://github.com/facebook/create-react-app
[ts]: https://www.typescriptlang.org
[eslint]: https://eslint.org
[prettier]: https://prettier.io
[storybook]: https://storybook.js.org
[cypress]: https://www.cypress.io
[jest]: https://jestjs.io/
[sme]: https://www.npmjs.com/package/source-map-explorer
[husky]: https://github.com/typicode/husky
[react]: https://reactjs.org/
[fractal]: https://github.com/owanturist/Fractal
[emotion]: https://emotion.sh
