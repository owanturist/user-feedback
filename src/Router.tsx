import React, { FC, ReactNode } from 'react'
import { Cmd } from 'frctl'
import { Url } from 'frctl/Url'
import { Parser as UrlParser } from 'frctl/Url/Parser'
import Maybe from 'frctl/Maybe'
import { NavigationConsumer } from 'Provider'
import * as api from 'api'

export type Navigation = {
  replace(url: string): Cmd<never>

  push(url: string): Cmd<never>

  back(steps: number): Cmd<never>

  forward(steps: number): Cmd<never>

  load(url: string): Cmd<never>
}

export type Route =
  | {
      type: 'ToDashboard'
      search: Maybe<string>
      rating: Maybe<api.Rating>
    }
  | { type: 'ToFeedback'; feedbackId: string }

export const ToDashboard = (
  search: Maybe<string>,
  rating: Maybe<api.Rating>
): Route => ({
  type: 'ToDashboard',
  search,
  rating
})

export const ToFeedback = (feedbackId: string): Route => ({
  type: 'ToFeedback',
  feedbackId
})

const stringifyRoute = (route: Route): string => {
  switch (route.type) {
    case 'ToDashboard': {
      const queries = [
        route.search.map(s => `search=${s}`),
        route.rating.map(r => `rating=${r}`)
      ]
        .map(m => m.getOrElse(''))
        .filter(s => s !== '')

      return queries.length === 0 ? '/' : `/?${queries.join('&')}`
    }

    case 'ToFeedback': {
      return `/feedback/${route.feedbackId}`
    }
  }
}

const parser = UrlParser.oneOf([
  UrlParser.oneOf([UrlParser.root, UrlParser.s('dashboard')])
    .query('search')
    .string.query('rating')
    .enum([
      ['1', api.Rating.One],
      ['2', api.Rating.Two],
      ['3', api.Rating.Three],
      ['4', api.Rating.Four],
      ['5', api.Rating.Five]
    ])
    .map(search => rating => ToDashboard(search, rating)),

  UrlParser.s('feedback').slash.string.map(ToFeedback)
])

export const parse = (url: Url): Maybe<Route> => parser.parse(url)

const ViewLink: FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    onChangeUrl(href: string): void
  }
> = React.memo(({ onChangeUrl, ...props }) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a
    {...props}
    onClick={React.useCallback(
      event => {
        onChangeUrl(event.currentTarget.href)
        event.preventDefault()
      },
      [onChangeUrl]
    )}
  />
))

export const Link: FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    route: Route
    children: ReactNode
  }
> = props => (
  <NavigationConsumer>
    {onChangeUrl => (
      <ViewLink
        {...props}
        href={stringifyRoute(props.route)}
        onChangeUrl={onChangeUrl}
      />
    )}
  </NavigationConsumer>
)
