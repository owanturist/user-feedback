import React from 'react'
import styled from '@emotion/styled/macro'

import theme from 'theme'
import Screen from 'components/Screen'
import { Link, toDashboard } from 'Router'

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

const StyledHeader = styled.div`
  text-align: center;
`

const StyledRoot = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  padding: 50px 16px;
  max-width: 400px;
  color: ${theme.dark};
  background: #fff;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
  text-align: center;
`

const Page404: React.FC = React.memo(() => (
  <Screen
    data-cy="page404__root"
    header={<StyledHeader>Page Not Found</StyledHeader>}
  >
    <StyledRoot>
      <StyledCode>404</StyledCode>
      <StyledExplanation>This page is missing</StyledExplanation>
      <StyledBackLink>
        <Link data-cy="page404__dashboard-link" to={toDashboard}>
          Go Dashboard
        </Link>
      </StyledBackLink>
    </StyledRoot>
  </Screen>
))

export default Page404
