import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion/macro'
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
import * as ViewportScreen from './ViewportScreen'
import { ReactComponent as MarkerIcon } from './marker.svg'

const ellipsisString = (maxLengh: number, input: string): string => {
  return input.length > maxLengh ? input.slice(0, maxLengh) + '...' : input
}

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

const cssMap = css`
  flex: 1 0 auto;
  margin-top: 15px;
`

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
  flex: 1 1 auto;
  margin: 10px 0 0 10px;
  padding: 20px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
  word-break: break-word;
`

const ViewSection: FC<{ title?: ReactNode }> = ({ title, children }) => (
  <StyledSection>
    {title && <StyledSectionTitle>{title}</StyledSectionTitle>}
    <StyledSectionContent>{children}</StyledSectionContent>
  </StyledSection>
)

const ViewMap = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN || ''
})

const StyledMarkerIcon = styled(MarkerIcon)`
  height: 50px;
  color: #be1ea0;
`

const StyledMapSection = styled(StyledSection)`
  display: flex;
  flex-direction: column;
`

const StyledMapSectionContent = styled(StyledSectionContent)`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`

const ViewMapSection: FC<{
  geo: api.Geo
}> = React.memo(({ geo }) => (
  <StyledMapSection>
    <StyledSectionTitle>Geo location</StyledSectionTitle>

    <StyledMapSectionContent>
      <ViewPairs>
        <ViewPair label="Country">{geo.country}</ViewPair>
        <ViewPair label="City">{geo.city}</ViewPair>
      </ViewPairs>

      <ViewMap
        className={cssMap}
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
      </ViewMap>
    </StyledMapSectionContent>
  </StyledMapSection>
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

const ViewScreenViewportSection: FC<{
  viewport: api.Viewport
  screen: api.Screen
}> = React.memo(({ viewport, screen }) => {
  const [selection, setSelection] = React.useState<ViewportScreen.Selection>(
    ViewportScreen.Selection.None
  )
  const selectViewport = (): void =>
    setSelection(ViewportScreen.Selection.Viewport)
  const selectScreen = (): void => setSelection(ViewportScreen.Selection.Screen)
  const unselect = (): void => setSelection(ViewportScreen.Selection.None)

  const titleView = (
    <>
      <StyledScreenMarker
        dim={selection === ViewportScreen.Selection.Viewport}
        onMouseEnter={selectScreen}
        onMouseLeave={unselect}
      >
        Screen
      </StyledScreenMarker>{' '}
      &{' '}
      <StyledViewportMarker
        dim={selection === ViewportScreen.Selection.Screen}
        onMouseEnter={selectViewport}
        onMouseLeave={unselect}
      >
        Viewport
      </StyledViewportMarker>
    </>
  )

  return (
    <ViewSection title={titleView}>
      <ViewportScreen.View
        selected={selection}
        viewport={viewport}
        screen={screen}
        onSelect={setSelection}
      />
    </ViewSection>
  )
})

const ViewBasicSection: FC<{ feedback: api.FeedbackDetailed }> = ({
  feedback
}) => (
  <ViewSection>
    <ViewPairs>
      <ViewPair label="Creation Date">
        {feedback.creationDate.format('HH:mm, DD.MM.YYYY')}
      </ViewPair>

      {feedback.email.cata({
        Nothing: () => null,

        Just: email => (
          <ViewPair label="Contact email">
            <Router.Link href={`mailto:${email}`} title="Write an email">
              {email}
            </Router.Link>
          </ViewPair>
        )
      })}

      <ViewPair label="Source url">
        <Router.Link href={feedback.url} title={feedback.url} target="_blank">
          {ellipsisString(50, feedback.url)}
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
  min-width: 200px;
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

const StyledBackLink = styled.div`
  margin: 10px 0 0 10px;
  padding: 5px 0;
  flex: 1 0 100%;
`

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  margin: -10px 0 0 -10px;

  @media ${breakpoints.big.minWidth} {
    flex-flow: row nowrap;
  }
`

const StyledInfo = styled.div`
  display: flex;
  flex-flow: row wrap;
  flex: 1 1 0;

  @media ${breakpoints.big.minWidth} {
    flex-direction: column;
  }
`

const ViewSucceed: FC<{ feedback: api.FeedbackDetailed }> = React.memo(
  ({ feedback }) => (
    <StyledRoot>
      <StyledInfo>
        <StyledBackLink>
          <Router.Link route={Router.ToDashboard()}>
            ← Back to Dashboard
          </Router.Link>
        </StyledBackLink>

        <ViewBasicSection feedback={feedback} />

        <ViewBrowserSection browser={feedback.browser} />

        <ViewSection title="Comment">{feedback.comment}</ViewSection>

        <ViewScreenViewportSection
          viewport={feedback.viewport}
          screen={feedback.screen}
        />
      </StyledInfo>

      <ViewMapSection geo={feedback.geo} />
    </StyledRoot>
  )
)

const StyledHttpFailureReport = styled(HttpFailureReport)`
  margin: 0 auto;
`

export const View: FC<{
  feedbackId: string
  model: Model
  dispatch: Dispatch<Msg>
}> = ({ feedbackId, model, dispatch, ...props }) =>
  model.feedback.cata({
    Loading: () => <SkeletonRoot />,

    Failure: error => (
      <StyledHttpFailureReport
        error={error}
        onTryAgain={() => dispatch(LoadFeedback(feedbackId))}
      />
    ),

    Succeed: feedback => <ViewSucceed feedback={feedback} />
  })

// H E A D E R

const cssRating = css`
  margin-right: 10px;
`

const StyledHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Header: FC<{ model: Model }> = React.memo(({ model }) => (
  <StyledHeader>
    {model.feedback.cata({
      Loading: () => <Rating.Skeleton className={cssRating} />,
      Failure: () => null,
      Succeed: ({ rating }) => (
        <Rating.Static className={cssRating} rating={rating} />
      )
    })}
    Feedback Details
  </StyledHeader>
))

// S K E L E T O N

const SkeletonPairs: FC<{ count: number }> = React.memo(({ count }) => (
  <ViewPairs>
    {new Array(count).fill(null).map((_, i) => (
      <tr key={i}>
        <td>
          <Skeleton.Text />
        </td>
      </tr>
    ))}
  </ViewPairs>
))

const SkeletonRoot: FC = React.memo(() => (
  <StyledRoot>
    <StyledInfo>
      <StyledBackLink>
        <Skeleton.Text />
      </StyledBackLink>

      <ViewSection>
        <SkeletonPairs count={3} />
      </ViewSection>

      <ViewSection title={<Skeleton.Text />}>
        <SkeletonPairs count={4} />
      </ViewSection>

      <ViewSection title={<Skeleton.Text />}>
        <ViewportScreen.Skeleton />
      </ViewSection>
    </StyledInfo>

    <ViewSection title={<Skeleton.Text />}>
      <SkeletonPairs count={2} />

      <Skeleton.Rect className={cssMap} width="100%" height="450px" />
    </ViewSection>
  </StyledRoot>
))
