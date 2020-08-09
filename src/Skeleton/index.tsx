import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import { css, cx, keyframes } from 'emotion/macro'

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

const StyledText = styled.span`
  display: inline-block;
  width: 100%;
  border-radius: 3px;
  line-height: 1;
  user-select: none;
`

export const Text: FC<{
  count?: number
}> = ({ count = 1 }) =>
  count > 0 ? (
    <>
      {new Array(count).fill(0).map((_, i) => (
        <StyledText key={i} className={background}>
          &zwnj;
        </StyledText>
      ))}
    </>
  ) : null

type StyledBlockProp = {
  className?: string
  inline?: boolean
  circle?: boolean
}

const StyledBlock = styled.span<StyledBlockProp>`
  display: ${props => (props.inline ? 'inline-block' : 'block')};
  font-size: 0;
  border-radius: ${props => (props.circle ? '50%' : '3px')};
  line-height: 1;
  vertical-align: top;
  user-select: none;
`

export const Rect: FC<{
  className?: string
  inline?: boolean
  width: number | string
  height: number | string
}> = ({ className, inline, width, height }) => (
  <StyledBlock
    className={cx(background, className)}
    inline={inline}
    style={{
      width: pxOrLen(width),
      height: pxOrLen(height)
    }}
  />
)

export const Circle: FC<{
  className?: string
  inline?: boolean
  size: number | string
}> = ({ className, inline, size }) => (
  <StyledBlock
    className={cx(background, className)}
    circle
    inline={inline}
    style={{
      width: pxOrLen(size),
      height: pxOrLen(size)
    }}
  />
)
