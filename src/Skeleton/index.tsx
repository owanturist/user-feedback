import React, { FC } from 'react'
import { css, keyframes } from 'emotion/macro'
import styled from '@emotion/styled/macro'

const COLOR_BASE = '#c8c8c8'
const COLOR_GLOW = '#f5f5f5'

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
  radius: string
}

const StyledBlock = styled.span<StyledBlockProp>`
  display: block;
  font-size: 0;
  border-radius: ${props => props.radius};
  line-height: 1;

  ${background};
`

export const Rect: FC<{ width: number | string; height: number | string }> = ({
  width,
  height
}) => (
  <StyledBlock
    className={background}
    radius="3px"
    style={{
      width: pxOrLen(width),
      height: pxOrLen(height)
    }}
  />
)

export const Circle: FC<{ size: number | string }> = ({ size }) => (
  <StyledBlock
    className={background}
    radius="50%"
    style={{
      width: pxOrLen(size),
      height: pxOrLen(size)
    }}
  />
)
