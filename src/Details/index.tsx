import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled/macro'
import { Map as ReactMapboxGl, Marker } from 'react-mapbox-gl'
import { Cmd } from 'frctl'
import { cons } from 'frctl/Basics'
import * as Http from 'frctl/Http'
import Either from 'frctl/Either'
import RemoteData from 'frctl/RemoteData'

import { Dispatch } from 'Provider'
import * as breakpoints from 'breakpoints'
import * as api from 'api'
import * as utils from 'utils'
import * as Router from 'Router'
import * as Skeleton from 'Skeleton'
import * as Rating from 'Rating'
import HttpFailureReport from 'HttpFailureReport'
import { ReactComponent as MarkerIcon } from './marker.svg'

// M O D E L

export type Model = {
  feedback: RemoteData<Http.Error, api.FeedbackDetailed>
}

export const initial: Model = {
  feedback: RemoteData.Loading
}

export const init = (feedbackId: string): [Model, Cmd<Msg>] => [
  initial,
  api.getFeedbackById(feedbackId).send(result => LoadFeedbackDone(result))
]

// U P D A T E

export type Msg = utils.Msg<[Model], [Model, Cmd<Msg>]>

const LoadFeedback = cons(
  class LoadFeedback implements Msg {
    public constructor(private readonly feedbackId: string) {}

    public update(model: Model): [Model, Cmd<Msg>] {
      return [
        {
          ...model,
          feedback: RemoteData.Loading
        },
        api
          .getFeedbackById(this.feedbackId)
          .send(result => LoadFeedbackDone(result))
      ]
    }
  }
)

const LoadFeedbackDone = cons(
  class LoadFeedbackDone implements Msg {
    public constructor(
      private readonly result: Either<Http.Error, api.FeedbackDetailed>
    ) {}

    public update(model: Model): [Model, Cmd<Msg>] {
      return [
        {
          ...model,
          feedback: RemoteData.fromEither(this.result)
        },
        Cmd.none
      ]
    }
  }
)

// V I E W

const VIEWPORT_WIDTH = 300

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
  flex: 1 0 auto;
  margin: 10px 0 0 10px;
  padding: 20px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
`

const ViewSection: FC<{ title?: ReactNode }> = ({
  title,
  children,
  ...props
}) => (
  <StyledSection {...props}>
    {title && <StyledSectionTitle>{title}</StyledSectionTitle>}
    <StyledSectionContent>{children}</StyledSectionContent>
  </StyledSection>
)

const StyledMap = styled(
  ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN || ''
  })
)`
  margin-top: 15px;
`

const StyledMarkerIcon = styled(MarkerIcon)`
  height: 50px;
  color: #be1ea0;
`

const ViewMapSection: FC<{
  geo: api.Geo
}> = React.memo(({ geo }) => (
  <ViewSection title="Geo location">
    <ViewPairs>
      <ViewPair label="Country">{geo.country}</ViewPair>
      <ViewPair label="City">{geo.city}</ViewPair>
    </ViewPairs>

    <StyledMap
      style="mapbox://styles/mapbox/streets-v11"
      containerStyle={{
        width: '100%',
        height: '450px'
      }}
      zoom={[14]}
      center={geo.position}
    >
      <Marker coordinates={geo.position}>
        <StyledMarkerIcon />
      </Marker>
    </StyledMap>
  </ViewSection>
))

type StyledViewportMarkerProps = {
  dim: boolean
}

const StyledViewportMarker = styled.span<StyledViewportMarkerProps>`
  padding-bottom: 2px;
  border-bottom: 2px solid #be1ea0;
  cursor: default;
  opacity: ${props => props.dim && 0.4};
`

const StyledScreenMarker = styled(StyledViewportMarker)`
  border-color: #1ea0be;
`

type StyledViewportProps = StyledViewportMarkerProps

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

enum ViewportSelection {
  None,
  Viewport,
  Screen
}

const ViewScreenViewportSection: FC<{
  viewport: api.Viewport
  screen: api.Screen
}> = React.memo(({ viewport, screen }) => {
  const relativePx = VIEWPORT_WIDTH / viewport.width
  const [selection, setSelection] = React.useState<ViewportSelection>(
    ViewportSelection.None
  )
  const selectViewport = (): void => setSelection(ViewportSelection.Viewport)
  const selectScreen = (): void => setSelection(ViewportSelection.Screen)
  const unselect = (): void => setSelection(ViewportSelection.None)

  const titleView = (
    <>
      <StyledScreenMarker
        dim={selection === ViewportSelection.Viewport}
        onMouseEnter={selectScreen}
        onMouseLeave={unselect}
      >
        Screen
      </StyledScreenMarker>{' '}
      &{' '}
      <StyledViewportMarker
        dim={selection === ViewportSelection.Screen}
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
          dim={selection === ViewportSelection.Screen}
          style={{
            height: `${relativePx * viewport.height}px`
          }}
          onMouseEnter={selectViewport}
          onMouseLeave={unselect}
        />

        <StyledScreen
          dim={selection === ViewportSelection.Viewport}
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

const ViewBasicSection: FC<{ feedback: api.FeedbackDetailed }> = ({
  feedback
}) => (
  <ViewSection>
    <ViewPairs>
      <ViewPair label="Rating">
        <Rating.Static rating={feedback.rating} />
      </ViewPair>

      <ViewPair label="Creation Date">
        {feedback.creationDate.format('HH:mm, dd.MM.YYYY')}
      </ViewPair>

      <ViewPair label="Contact email">
        <Router.Link href={`mailto:${feedback.email}`} title="Write an email">
          {feedback.email}
        </Router.Link>
      </ViewPair>

      <ViewPair label="Source url">
        <Router.Link
          href={feedback.url}
          title="Visit source url"
          target="_blank"
        >
          {feedback.url}
        </Router.Link>
      </ViewPair>
    </ViewPairs>
  </ViewSection>
)

const ViewBrowserSection: FC<{ browser: api.Browser }> = ({ browser }) => (
  <ViewSection title="Browser">
    <ViewPairs>
      <ViewPair label="Name">{browser.name}</ViewPair>
      <ViewPair label="Version">{browser.version}</ViewPair>
      <ViewPair label="Platform">{browser.platform}</ViewPair>
      <ViewPair label="Device">{browser.device}</ViewPair>
    </ViewPairs>
  </ViewSection>
)

const StyledTable = styled.table`
  font-size: 14px;

  td {
    padding: 2px;

    + td {
      padding-left: 20px;
    }
  }
`

const ViewPair: FC<{ label: ReactNode }> = ({ label, children }) => (
  <tr>
    <td>{label}</td>
    <td>{children}</td>
  </tr>
)

const ViewPairs: FC = ({ children }) => (
  <StyledTable>
    <tbody>{children}</tbody>
  </StyledTable>
)

const StyledSections = styled.div`
  display: flex;
  flex-direction: column;
  margin: -10px 0 0 -10px;

  @media ${breakpoints.big.minWidth} {
    flex-flow: row nowrap;
  }
`

const StyledCol = styled.div`
  display: flex;
  flex-flow: row wrap;

  @media ${breakpoints.big.minWidth} {
    flex-direction: column;
  }
`

const ViewSucceed: FC<{ feedback: api.FeedbackDetailed }> = React.memo(
  ({ feedback }) => (
    <StyledSections>
      <StyledCol>
        <ViewBasicSection feedback={feedback} />

        <ViewBrowserSection browser={feedback.browser} />

        <ViewScreenViewportSection
          viewport={feedback.viewport}
          screen={feedback.screen}
        />
      </StyledCol>

      <ViewMapSection geo={feedback.geo} />
    </StyledSections>
  )
)

const StyledRoot = styled.div``

export const View: FC<{
  feedbackId: string
  model: Model
  dispatch: Dispatch<Msg>
}> = ({ feedbackId, model, dispatch, ...props }) => (
  <StyledRoot {...props}>
    {model.feedback.cata({
      Loading: () => <Skeleton.Text />,

      Failure: error => (
        <HttpFailureReport
          error={error}
          onTryAgain={() => dispatch(LoadFeedback(feedbackId))}
        />
      ),

      Succeed: feedback => <ViewSucceed feedback={feedback} />
    })}
  </StyledRoot>
)

// S K E L E T O N
