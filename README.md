# User Feedback | [Demo](https://bit.ly/user-feedback-app) | [Storybook](https://bit.ly/user-feedback-ui)

_This project was bootstrapped with [Create React App][cra]._

## Available Scripts

In the project directory, you can run:

### `yarn start`

Builds and runs optimised app locally at [http://localhost:3000](http://localhost:3000).

### `yarn dev`

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
- State management with [redux][redux] and [redux-thunk][redux-thunk] for side effects
- Http requests via [axios][axios]
- CSS-in-JS via [Emotion][emotion]

## Features

- [x] responsible layout
- [x] greedy search to filter feedback by comment
- [x] uses [`Json/Decode`](https://github.com/owanturist/Fractal/tree/master/src/Json/Decode) to validate and transform an api response. See handling of a decode error in [ action](https://bit.ly/user-feedback-app-error)
- [x] client side routing
- [x] nice [detailed feedback](https://bit.ly/user-feedback-app-details) page
- [x] 404 page
- [ ] save and restore filters to url query

## Known issues

- [ ] Desktop Safary (V 13.1.2) slows down when dashboard scrolls to very top or bottom
- [ ] Device decodes a [hardcoded string](./src/api.ts#L24). User Agent parsing ([user-agent-parse](https://www.npmjs.com/package/user-agent-parse) or [ua-parser-js](https://github.com/faisalman/ua-parser-js)) does not provide any information for the majority of data.
- [ ] No scroll position restoration

[cra]: https://github.com/facebook/create-react-app
[ts]: https://www.typescriptlang.org
[eslint]: https://eslint.org
[prettier]: https://prettier.io
[storybook]: https://storybook.js.org
[cypress]: https://www.cypress.io
[jest]: https://jestjs.io
[sme]: https://www.npmjs.com/package/source-map-explorer
[husky]: https://github.com/typicode/husky
[react]: https://reactjs.org
[redux]: https://redux.js.org
[redux-thunk]: https://github.com/reduxjs/redux-thunk
[axios]: https://github.com/axios/axios
[emotion]: https://emotion.sh
