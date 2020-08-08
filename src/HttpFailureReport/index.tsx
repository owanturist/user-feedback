import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import * as Http from 'frctl/Http'

const StyledTryAgain = styled.button`
  box-sizing: border-box;
  display: inline-block;
  height: 40px;
  margin-top: 30px;
  padding: 9px 18px;
  border: none;
  border-radius: 3px;
  color: #e5ecf2;
  background: #1ea0be;
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

const ViewTryAgain: FC<{ onTryAgain(): void }> = ({ onTryAgain }) => (
  <StyledTryAgain
    data-cy="app__retry"
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
  color: #59636b;
  background: #fff;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
  text-align: center;
  word-break: break-word;
  overflow-y: auto;
`

const FailureReport: FC<{
  error: Http.Error
  onTryAgain(): void
}> = React.memo(({ error, onTryAgain, ...props }) =>
  error.cata({
    NetworkError: () => (
      <StyledRoot {...props}>
        <StyledTitle>You are facing a Network Error</StyledTitle>
        <StyledDescription>
          Pleace check your Internet connection and try again.
        </StyledDescription>

        <ViewTryAgain onTryAgain={onTryAgain} />
      </StyledRoot>
    ),

    Timeout: () => (
      <StyledRoot {...props}>
        <StyledTitle>You are facing a Timeout issue</StyledTitle>
        <StyledDescription>
          It takes too long to get a response so please check your Internect
          connection and try again.
        </StyledDescription>

        <ViewTryAgain onTryAgain={onTryAgain} />
      </StyledRoot>
    ),

    BadUrl: url => (
      <StyledRoot {...props}>
        <StyledTitle>Oops... we broke something...</StyledTitle>
        <StyledDescription>
          It looks like the app hits a wrong endpoint <code>{url}</code>.
        </StyledDescription>
        <StyledDescription>We are fixing the issue.</StyledDescription>
      </StyledRoot>
    ),

    BadStatus: ({ statusCode }) => {
      const [side, role] =
        statusCode < 500 ? ['Client', 'frontend'] : ['Server', 'backend']

      return (
        <StyledRoot {...props}>
          <StyledTitle>
            You are facing an unexpected {side}&nbsp;side&nbsp;Error&nbsp;
            {statusCode}!
          </StyledTitle>

          <StyledDescription>
            Our {role} developers are fixing the issue.
          </StyledDescription>
        </StyledRoot>
      )
    },

    BadBody: decoderError => (
      <StyledRoot {...props}>
        <StyledTitle>
          You are facing an unexpected Response Body Error!
        </StyledTitle>

        <StyledDescription>
          Something went wrong and our apps seems don't communicate well...
        </StyledDescription>

        <StyledPre>
          {decoderError
            .stringify(4)
            .replace(/\\"/g, '"')
            .replace(/\s{2}\s+"/, '\n\n"')
            .replace(/\\n/g, '\n')}
        </StyledPre>
      </StyledRoot>
    )
  })
)

export default FailureReport
