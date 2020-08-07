import React, { FC, ReactNode } from 'react'
import { Cmd } from 'frctl'
import { Cata, cons } from 'frctl/Basics'
import { Url } from 'frctl/Url'
import { Set } from 'frctl/Set'
import { Parser as UrlParser } from 'frctl/Url/Parser'
import Maybe from 'frctl/Maybe'
import { NavigationConsumer } from 'Provider'
import * as api from 'api'
import * as utils from 'utils'

export type Navigation = {
  replace(url: string): Cmd<never>

  push(url: string): Cmd<never>

  back(steps: number): Cmd<never>

  forward(steps: number): Cmd<never>

  load(url: string): Cmd<never>
}

export type DashboardFilters = {
  search: Maybe<string>
  rating: Set<api.Rating>
}

export type RoutePattern<R> = Cata<{
  ToDashboard(filters: DashboardFilters): R
  ToFeedback(feedbackId: string): R
}>

export type Route = {
  stringify(): string
  cata<R>(pattern: RoutePattern<R>): R
}

export const ToDashboard = cons(
  class ToDashboard implements Route {
    public constructor(private readonly filters: DashboardFilters) {}

    public stringify(): string {
      const queries = [
        this.filters.search.map(s => `search=${s}`).getOrElse(''),
        ...this.filters.rating.keys().map(r => `rating=${r}`)
      ].filter(q => q !== '')

      return queries.length === 0 ? '/' : `/?${queries.join('&')}`
    }

    public cata<R>(pattern: RoutePattern<R>): R {
      return utils.callOrElse(pattern._, pattern.ToDashboard, this.filters)
    }
  }
)

export const ToFeedback = cons(
  class ToFeedback implements Route {
    public constructor(private readonly feedbackId: string) {}

    public stringify(): string {
      return `/feedback/${this.feedbackId}`
    }

    public cata<R>(pattern: RoutePattern<R>): R {
      return utils.callOrElse(pattern._, pattern.ToFeedback, this.feedbackId)
    }
  }
)

const parser = UrlParser.oneOf([
  UrlParser.oneOf([UrlParser.root, UrlParser.s('dashboard')])
    .query('rating')
    .list.enum([
      ['1', api.Rating.One],
      ['2', api.Rating.Two],
      ['3', api.Rating.Three],
      ['4', api.Rating.Four],
      ['5', api.Rating.Five]
    ])
    .query('search')
    .string.map(rating => search =>
      ToDashboard({
        search,
        rating: Set.fromList(rating)
      })
    ),

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
        href={props.route.stringify()}
        onChangeUrl={onChangeUrl}
      />
    )}
  </NavigationConsumer>
)
