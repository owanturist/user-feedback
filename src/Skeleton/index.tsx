import React, { FC } from 'react'
import { css, cx, keyframes } from 'emotion/macro'
import styled from '@emotion/styled/macro'

const COLOR_BASE = 'hsl(0 0% 86%)'
const COLOR_GLOW = 'hsl(0 0% 96%)'

const pxOrLen = (value: number | string): string => {
  if (typeof value === 'string') {
    return value
  }

  return `${value}px`
}

const animationGlow = keyframes`
  0% {
    background-position: -200px 0;
  }

  100% {
    background-position: calc(200px + 100%) 0;
  }
`

export const background = css`
  animation: ${animationGlow} 1.2s ease-in-out infinite;
  background: ${COLOR_BASE} no-repeat;
  background-size: 200px 100%;
  background-image: linear-gradient(
    90deg,
    ${COLOR_BASE},
    ${COLOR_GLOW},
    ${COLOR_BASE}
  );
`

type StyledTextProps = {
  block?: boolean
}

const StyledText = styled.span<StyledTextProps>`
  display: ${props => (props.block ? 'block' : 'inline-block')};
`

const StyledTextLine = styled.span`
  display: inline-block;
  width: 100%;
  border-radius: 3px;
  line-height: 1;
`

export const Text: FC<{
  className?: string
  block?: boolean
  count?: number
}> = ({ className, block, count = 1 }) => (
  <StyledText className={className} block={block}>
    {new Array(Math.max(0, count)).fill(0).map((_, i) => (
      <StyledTextLine key={i} className={background}>
        &zwnj;
      </StyledTextLine>
    ))}
  </StyledText>
)

type StyledBlockProp = {
  className?: string
  block?: boolean
  circle?: boolean
}

const StyledBlock = styled.span<StyledBlockProp>`
  display: ${props => (props.block ? 'block' : 'inline-block')};
  font-size: 0;
  border-radius: ${props => (props.circle ? '50%' : '3px')};
  line-height: 1;
`

export const Rect: FC<{
  className?: string
  block?: boolean
  width: number | string
  height: number | string
}> = ({ className, block, width, height }) => (
  <StyledBlock
    className={cx(background, className)}
    block={block}
    style={{
      width: pxOrLen(width),
      height: pxOrLen(height)
    }}
  />
)

export const Circle: FC<{
  className?: string
  block?: boolean
  size: number | string
}> = ({ className, block, size }) => (
  <StyledBlock
    className={cx(background, className)}
    circle
    block={block}
    style={{
      width: pxOrLen(size),
      height: pxOrLen(size)
    }}
  />
)
