import React, { FC } from 'react'
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
  ToDetails(feedbackId: string): R
}>

export type Route = {
  stringify(): string
  cata<R>(pattern: RoutePattern<R>): R
}

export const ToDashboard = cons(
  class implements Route {
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

export const ToDetails = cons(
  class implements Route {
    public constructor(private readonly feedbackId: string) {}

    public stringify(): string {
      return `/details/${this.feedbackId}`
    }

    public cata<R>(pattern: RoutePattern<R>): R {
      return utils.callOrElse(pattern._, pattern.ToDetails, this.feedbackId)
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

  UrlParser.s('details').slash.string.map(ToDetails)
])

export const parse = (url: Url): Maybe<Route> => parser.parse(url)

const ViewLink: FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    onChangeUrl(href: string): void
  }
> = React.memo(({ onChangeUrl, children, ...props }) => (
  <a
    rel={props.target === '_blank' ? 'noreferrer' : null}
    {...props}
    onClick={React.useCallback(
      event => {
        onChangeUrl(event.currentTarget.href)
        event.preventDefault()
      },
      [onChangeUrl]
    )}
  >
    {children}
  </a>
))

export const Link: FC<
  | (Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
      route: Route
    })
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
> = props => (
  <NavigationConsumer>
    {onChangeUrl => (
      <ViewLink
        {...props}
        href={'route' in props ? props.route.stringify() : props.href}
        onChangeUrl={onChangeUrl}
      />
    )}
  </NavigationConsumer>
)
