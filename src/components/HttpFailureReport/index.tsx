import React from 'react'
import styled from '@emotion/styled/macro'
import { Error as DecodeError } from 'frctl/Json/Decode'

import theme from 'theme'
import { ResponseError } from 'api'

const StyledTryAgain = styled.button`
  box-sizing: border-box;
  display: inline-block;
  height: 40px;
  margin-top: 30px;
  padding: 9px 18px;
  border: none;
  border-radius: 3px;
  color: ${theme.cloud};
  background: ${theme.primary};
  font-weight: 600;
  font-size: 22px;
  font-family: inherit;
  line-height: 1;
  user-select: none;
  outline: none;
  cursor: pointer;
  transition: box-shadow 0.2s ease-in-out;

  &:focus {
    box-shadow: 0 0 0 2px rgb(30, 160, 190, 0.5);
  }
`

const ViewTryAgain: React.FC<{ onTryAgain(): void }> = ({ onTryAgain }) => (
  <StyledTryAgain
    data-cy="http__retry"
    autoFocus
    type="button"
    tabIndex={0}
    onClick={onTryAgain}
  >
    Try Again
  </StyledTryAgain>
)

const StyledTitle = styled.h1`
  margin: 0;
  font-weight: 600;
  font-size: 24px;
`

const StyledDescription = styled.p`
  margin: 20px 0 0;
  font-size: 18px;
`

const StyledPre = styled.pre`
  margin: 20px 0 0;
  max-width: 100%;
  overflow: auto;
  font-size: 13px;
  text-align: left;
`

const StyledRoot = styled.div`
  box-sizing: border-box;
  max-width: 560px;
  padding: 50px;
  border-radius: 3px;
  color: ${theme.dark};
  background: #fff;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
  text-align: center;
  word-break: break-word;
  overflow-y: auto;
`

const ViewDecodeError: React.FC<{
  decodeError: DecodeError
}> = ({ decodeError }) => (
  <>
    <StyledTitle>You are facing an unexpected Response Body Error!</StyledTitle>

    <StyledDescription>
      Something went wrong and our apps seems don't communicate well...
    </StyledDescription>

    <StyledPre>
      {decodeError
        .stringify(4)
        .replace(/\\"/g, '"')
        .replace(/\s{2}\s+"/, '\n\n"')
        .replace(/\\n/g, '\n')}
    </StyledPre>
  </>
)

const ViewStringError: React.FC<{
  message: string
  onTryAgain(): void
}> = ({ message, onTryAgain }) => (
  <>
    <StyledTitle>You are facing HTTP Error</StyledTitle>

    <StyledDescription>{message}</StyledDescription>

    <ViewTryAgain onTryAgain={onTryAgain} />
  </>
)

export type HttpFailureReportProps = React.HTMLAttributes<HTMLDivElement> & {
  error: ResponseError
  onTryAgain(): void
}

const HttpFailureReport: React.FC<HttpFailureReportProps> = ({
  error,
  onTryAgain,
  ...props
}) => (
  <StyledRoot {...props}>
    {typeof error === 'string' ? (
      <ViewStringError message={error} onTryAgain={onTryAgain} />
    ) : (
      <ViewDecodeError decodeError={error} />
    )}
  </StyledRoot>
)

export default HttpFailureReport
