import React, { FC } from 'react'
import { css, keyframes } from 'emotion/macro'
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

const StyledText = styled.span`
  display: inline-block;
  width: 100%;
  border-radius: 3px;
  line-height: 1;
`

export const Text: FC<{ count?: number }> = ({ count = 1 }) => {
  return count > 0 ? (
    <>
      {new Array(count).fill(0).map((_, i) => (
        <StyledText key={i} className={background}>
          &zwnj;
        </StyledText>
      ))}
    </>
  ) : null
}

type StyledBlockProp = {
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
  block?: boolean
  width: number | string
  height: number | string
}> = ({ block, width, height }) => (
  <StyledBlock
    className={background}
    block={block}
    style={{
      width: pxOrLen(width),
      height: pxOrLen(height)
    }}
  />
)

export const Circle: FC<{ block?: boolean; size: number | string }> = ({
  block,
  size
}) => (
  <StyledBlock
    className={background}
    circle
    block={block}
    style={{
      width: pxOrLen(size),
      height: pxOrLen(size)
    }}
  />
)
