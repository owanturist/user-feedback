import React, { FC } from 'react'
import styled from '@emotion/styled/macro'

import * as Router from 'Router'

const StyledBackLink = styled.div`
  margin-top: 20px;
  font-size: 16px;
`

const StyledExplanation = styled.p`
  margin: 20px 0 0;
  font-size: 24px;
`

const StyledCode = styled.big`
  font-weight: 600;
  font-size: 72px;
`

const StyledRoot = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  padding: 50px 16px;
  max-width: 400px;
  color: #59636b;
  background: #fff;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
  text-align: center;
`

export const View: FC = React.memo(() => (
  <StyledRoot data-cy="page404__root">
    <StyledCode>404</StyledCode>
    <StyledExplanation>This page is missing</StyledExplanation>
    <StyledBackLink>
      <Router.Link
        data-cy="page404__dashboard-link"
        route={Router.ToDashboard()}
      >
        Go Dashboard
      </Router.Link>
    </StyledBackLink>
  </StyledRoot>
))

const StyledHeader = styled.div`
  text-align: center;
`

export const Header: FC = React.memo(() => (
  <StyledHeader>Page Not Found</StyledHeader>
))
