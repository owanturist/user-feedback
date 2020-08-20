import React, { ReactNode } from 'react'
import styled from '@emotion/styled/macro'

import breakpoints from 'breakpoints'

const StyledHeader = styled.header`
  box-sizing: border-box;
  position: relative; /* shadow overflow of content */
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 0 0 auto;
  min-height: 67px;
  padding: 5px 16px;
  margin: 0;
  color: #5e6264;
  background: #fff;
  box-shadow: 0 0 2px 2px #dadee0;
  font-weight: 600;
  font-size: 26px;
  letter-spacing: 0.02em;
  user-select: none;
`

const StyledContainer = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  padding: 16px;
  width: 100%;
  max-width: 1454px;

  @media ${breakpoints.big.minWidth} {
    padding-top: 28px;
  }
`

const StyledScroller = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  scroll-behavior: smooth;
`

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

export type ScreenProps = React.HTMLAttributes<HTMLDivElement> & {
  header: ReactNode
}

const Screen: React.FC<ScreenProps> = ({ header, children, ...props }) => (
  <StyledRoot {...props}>
    <StyledHeader>{header}</StyledHeader>

    <StyledScroller>
      <StyledContainer>{children}</StyledContainer>
    </StyledScroller>
  </StyledRoot>
)

export default Screen
