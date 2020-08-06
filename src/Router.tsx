import React, { FC, ReactNode } from 'react'
import { Cmd } from 'frctl'
import { Cata } from 'frctl/Basics'
import { Url } from 'frctl/Url'
import { NavigationConsumer } from 'Provider'

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

export type UrlRequest = {
  cata<R>(pattern: UrlRequestPattern<R>): R
}

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
    href: string
    children: ReactNode
  }
> = props => (
  <NavigationConsumer>
    {onChangeUrl => <ViewLink {...props} onChangeUrl={onChangeUrl} />}
  </NavigationConsumer>
)
