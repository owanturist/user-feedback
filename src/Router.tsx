import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import { Cmd } from 'frctl'
import { Cata, cons } from 'frctl/Basics'
import { Url } from 'frctl/Url'
import { Set } from 'frctl/Set'
import { Parser as UrlParser } from 'frctl/Url/Parser'
import Maybe from 'frctl/Maybe'

import theme from 'theme'
import * as api from 'api'
import { NavigationConsumer } from 'Provider'
import { callOrElse, nonEmptyString } from 'utils'

/**
 * Set of navigation command creators
 */
export type Navigation = {
  replace(url: string): Cmd<never>
  push(url: string): Cmd<never>
  back(steps: number): Cmd<never>
  forward(steps: number): Cmd<never>
  load(url: string): Cmd<never>
}

export type UrlRequestPattern<R> = Cata<{
  Internal(url: Url): R
  External(url: string): R
}>

/**
 * Internal message triggered when app url is changed via Link
 */
export type UrlRequest = {
  cata<R>(pattern: UrlRequestPattern<R>): R
}

export type DashboardFilters = {
  search: Maybe<string>
  rating: Set<api.Rating>
}

export type RoutePattern<R> = Cata<{
  ToDashboard(filters: DashboardFilters): R
  ToDetails(feedbackId: string): R
}>

/**
 * Represents an applications' route interface.
 */
export type Route = {
  stringify(): string
  cata<R>(pattern: RoutePattern<R>): R
}

export type ToDashboardFilters = {
  search?: string
  rating?: Array<api.Rating>
}

/**
 * Represents a Route to dashboard.
 *
 * @param args_0 an optional filters object
 */
export const ToDashboard = cons<[] | [ToDashboardFilters], Route>(
  class implements Route {
    private readonly filters: DashboardFilters

    public constructor(filters?: ToDashboardFilters) {
      this.filters = {
        search: Maybe.fromNullable(filters?.search).chain(nonEmptyString),
        rating: Set.fromList(filters?.rating || [])
      }
    }

    public stringify(): string {
      // @TODO use/implement some tool to construct query object
      // in an easy and natural way
      const queries = [
        this.filters.search.map(s => `search=${s}`).getOrElse(''),
        ...this.filters.rating.keys().map(r => `rating=${r}`)
      ].filter(q => q !== '')

      return queries.length === 0 ? '/' : `/?${queries.join('&')}`
    }

    public cata<R>(pattern: RoutePattern<R>): R {
      return callOrElse(pattern._, pattern.ToDashboard, this.filters)
    }
  }
)

/**
 * Represents a Route to details page.
 *
 * @param args_0 an id of feedback item for detail view
 */
export const ToDetails = cons<[string], Route>(
  class implements Route {
    public constructor(private readonly feedbackId: string) {}

    public stringify(): string {
      return `/details/${this.feedbackId}`
    }

    public cata<R>(pattern: RoutePattern<R>): R {
      return callOrElse(pattern._, pattern.ToDetails, this.feedbackId)
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
        search: search.getOrElse(''),
        rating
      })
    ),

  UrlParser.s('details').slash.string.map(ToDetails)
])

/**
 * Converts an Url into a Just<Route> when matches and Nothing otherwise.
 */
export const parse = (url: Url): Maybe<Route> => parser.parse(url)

const StyledLink = styled.a`
  color: ${theme.primary};
`

const ViewLink: FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    onChangeUrl(href: string): void
  }
> = React.memo(({ onChangeUrl, ...props }) => {
  const hasTarget = typeof props.target !== 'undefined'
  const hasDownload = typeof props.download !== 'undefined'

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
      // handle only simple left click mouse button event
      // opens link in the same browsers' page
      // otherwise perform as a regular link
      if (
        event.button < 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        !hasTarget &&
        !hasDownload
      ) {
        onChangeUrl(event.currentTarget.href)
        event.preventDefault()
      }
    },
    [hasDownload, hasTarget, onChangeUrl]
  )

  if (props.target === '_blank' && typeof props.rel === 'undefined') {
    return <StyledLink {...props} rel="noreferrer" onClick={onClick} />
  }

  return <StyledLink {...props} onClick={onClick} />
})

/**
 * App link produces `UrlRequest` on click.
 *
 * @example
 *
 * <Link route={toDashboard()}>Go Dashboard</Link>
 *
 * <Link href="/dashboard">Go Dashboard</Link>
 */
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
