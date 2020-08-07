import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion/macro'
import { Cmd } from 'frctl'
import * as Http from 'frctl/Http'
import RemoteData from 'frctl/RemoteData'

import { Dispatch } from 'Provider'
import * as api from 'api'
import * as utils from 'utils'
import * as Router from 'Router'
import * as Skeleton from 'Skeleton'

// M O D E L

export type Model = {
  feedback: RemoteData<Http.Error, api.FeedbackDetailed>
}

export const init: [Model, Cmd<Msg>] = [
  {
    feedback: RemoteData.Loading
  },
  Cmd.none
]

// U P D A T E

export type Msg = utils.Msg<[Model], [Model, Cmd<Msg>]>

// V I E W

const cssLink = css`
  color: #1ea0be;
`

const VIEWPORT_WIDTH = 300

const StyledViewportMarker = styled.span`
  padding-bottom: 2px;
  border-bottom: 2px solid #be1ea0;
  cursor: default;
`

const StyledScreenMarker = styled(StyledViewportMarker)`
  border-color: #1ea0be;
`

type StyledViewportProps = {
  dim: boolean
}

const StyledViewport = styled.div<StyledViewportProps>`
  position: relative;
  z-index: ${props => (props.dim ? 1 : 2)};
  background: #be1ea0;
  border-radius: 2px;
  width: ${VIEWPORT_WIDTH}px;
  opacity: ${props => (props.dim ? 0.4 : 0.7)};
`

const StyledScreen = styled(StyledViewport)`
  position: absolute;
  top: 0;
  left: 0;
  background: #1ea0be;
`

const StyledViewportContainer = styled.div`
  position: relative;
`

type ViewScreenViewportSectionState = {
  selected: 'none' | 'viewport' | 'screen'
}

const ViewScreenViewportSection: FC<{
  viewport: api.Viewport
  screen: api.Screen
}> = React.memo(({ viewport, screen }) => {
  const relativePx = VIEWPORT_WIDTH / viewport.width
  const [{ selected }, setState] = React.useState<
    ViewScreenViewportSectionState
  >({
    selected: 'none'
  })
  const selectViewport = (): void => setState({ selected: 'viewport' })
  const selectScreen = (): void => setState({ selected: 'screen' })
  const unselect = (): void => setState({ selected: 'none' })

  const titleView = (
    <>
      <StyledScreenMarker onMouseEnter={selectScreen} onMouseLeave={unselect}>
        Screen
      </StyledScreenMarker>{' '}
      &{' '}
      <StyledViewportMarker
        onMouseEnter={selectViewport}
        onMouseLeave={unselect}
      >
        Viewport
      </StyledViewportMarker>
    </>
  )

  return (
    <ViewSection title={titleView}>
      <StyledViewportContainer>
        <StyledViewport
          dim={selected === 'screen'}
          style={{
            height: `${relativePx * viewport.height}px`
          }}
          onMouseEnter={selectViewport}
          onMouseLeave={unselect}
        />

        <StyledScreen
          dim={selected === 'viewport'}
          style={{
            top: `${relativePx * screen.availableTop}px`,
            left: `${relativePx * screen.availableLeft}px`,
            width: `${relativePx * screen.availableWidth}px`,
            height: `${relativePx * screen.availableHeight}px`
          }}
          onMouseEnter={selectScreen}
          onMouseLeave={unselect}
        />
      </StyledViewportContainer>
    </ViewSection>
  )
})

const StyledTable = styled.table`
  td {
    padding: 2px 5px;
    font-size: 14px;
  }
`

const ViewPairs: FC<{ items: Array<[string, ReactNode]> }> = ({ items }) => (
  <StyledTable>
    <tbody>
      {items.map(([label, content]) => (
        <tr key={label}>
          <td>{label}</td>
          <td>{content}</td>
        </tr>
      ))}
    </tbody>
  </StyledTable>
)

const StyledSectionTitle = styled.h3`
  margin: 0;
  color: #333;
  font-weight: 600;
  font-size: 18px;
`

const StyledSectionContent = styled.div`
  margin: 16px 0 0;
  color: #59636b;
`

const StyledSection = styled.section`
  margin: 10px 0 0 10px;
  padding: 20px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
`

const ViewSection: FC<{ title: ReactNode }> = ({ title, children }) => (
  <StyledSection>
    <StyledSectionTitle>{title}</StyledSectionTitle>
    <StyledSectionContent>{children}</StyledSectionContent>
  </StyledSection>
)

const StyledSections = styled.div`
  display: flex;
  flex-direction: column;
  margin: -10px 0 0 -10px;
`

const ViewSucceed: FC<{ feedback: api.FeedbackDetailed }> = React.memo(
  ({ feedback }) => (
    <StyledSections>
      <ViewSection title="Contact email">
        <a
          className={cssLink}
          href={`mailto:${feedback.email}`}
          title="Write an email"
        >
          {feedback.email}
        </a>
      </ViewSection>

      <ViewSection title="Source URL">
        <Router.Link
          className={cssLink}
          href={feedback.url}
          title="Visit source url"
          target="_blank"
        >
          {feedback.url}
        </Router.Link>
      </ViewSection>

      <ViewSection title="Browser">
        <ViewPairs
          items={[
            ['Name', feedback.browser.name],
            ['Version', feedback.browser.version],
            ['Platform', feedback.browser.platform],
            ['Device', feedback.browser.device]
          ]}
        />
      </ViewSection>

      <ViewScreenViewportSection
        viewport={feedback.viewport}
        screen={feedback.screen}
      />
    </StyledSections>
  )
)

const StyledRoot = styled.div``

export const View: FC<{
  className?: string
  feedbackId: string
  model: Model
  dispatch: Dispatch<Msg>
}> = ({ className, model }) => (
  <StyledRoot className={className}>
    {model.feedback.cata({
      Loading: () => <Skeleton.Text />,

      Failure: () => null,

      Succeed: feedback => <ViewSucceed feedback={feedback} />
    })}
  </StyledRoot>
)

// S K E L E T O N
