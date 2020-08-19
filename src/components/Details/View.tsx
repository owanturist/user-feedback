import React from 'react'
// import React, { FC, ReactNode } from 'react'
// import styled from '@emotion/styled/macro'
// import { Map as ReactMapboxGl, Marker } from 'react-mapbox-gl'

// import theme from 'theme'
// import * as breakpoints from 'breakpoints'
// import * as api from 'api'
// import * as Router from 'Router'
// import { View as ViewViewportScreen, Selection } from './ViewportScreen'
// import {
//   cssMap,
//   StyledSection,
//   StyledSectionTitle,
//   ViewSection
// } from './Layout'
// import { ReactComponent as MarkerIcon } from './marker.svg'

// const ellipsisString = (maxLengh: number, input: string): string => {
//   return input.length > maxLengh ? input.slice(0, maxLengh) + '...' : input
// }

// const ViewMap = ReactMapboxGl({
//   accessToken: process.env.REACT_APP_MAPBOX_TOKEN || ''
// })

// const StyledMarkerIcon = styled(MarkerIcon)`
//   height: 50px;
//   color: ${theme.secondary};
// `

// const StyledMapSection = styled(StyledSection)`
//   display: flex;
//   flex-direction: column;
// `

// const StyledMapSectionContent = styled.div`
//   display: flex;
//   flex-direction: column;
//   flex: 1 0 auto;
//   align-items: flex-start;
// `

// const ViewMapSection: FC<{
//   geo: api.Geo
// }> = React.memo(({ geo }) => (
//   <StyledMapSection>
//     <StyledSectionTitle>Geo location</StyledSectionTitle>

//     <StyledMapSectionContent>
//       <ViewPairs>
//         <ViewPair label="Country">{geo.country}</ViewPair>
//         <ViewPair label="City">{geo.city}</ViewPair>
//       </ViewPairs>

//       <ViewMap
//         className={cssMap}
//         style="mapbox://styles/mapbox/streets-v11"
//         containerStyle={{
//           width: '100%',
//           height: '450px'
//         }}
//         zoom={[14]}
//         center={geo.position}
//       >
//         <Marker coordinates={geo.position}>
//           <StyledMarkerIcon />
//         </Marker>
//       </ViewMap>
//     </StyledMapSectionContent>
//   </StyledMapSection>
// ))

// type StyledViewportMarkerProps = {
//   dim: boolean
// }

// const StyledViewportMarker = styled.span<StyledViewportMarkerProps>`
//   padding-bottom: 2px;
//   border-bottom: 2px solid ${theme.secondary};
//   cursor: default;
//   opacity: ${props => props.dim && 0.4};
// `

// const StyledScreenMarker = styled(StyledViewportMarker)`
//   border-color: ${theme.primary};
// `

// const ViewScreenViewportSection: FC<{
//   viewport: api.Viewport
//   screen: api.Screen
// }> = React.memo(({ viewport, screen }) => {
//   const [selection, setSelection] = React.useState<Selection>(Selection.None)
//   const selectViewport = (): void => setSelection(Selection.Viewport)
//   const selectScreen = (): void => setSelection(Selection.Screen)
//   const unselect = (): void => setSelection(Selection.None)

//   const titleView = (
//     <>
//       <StyledScreenMarker
//         dim={selection === Selection.Viewport}
//         onMouseEnter={selectScreen}
//         onMouseLeave={unselect}
//       >
//         Screen
//       </StyledScreenMarker>{' '}
//       &{' '}
//       <StyledViewportMarker
//         dim={selection === Selection.Screen}
//         onMouseEnter={selectViewport}
//         onMouseLeave={unselect}
//       >
//         Viewport
//       </StyledViewportMarker>
//     </>
//   )

//   return (
//     <ViewSection title={titleView}>
//       <ViewViewportScreen
//         selected={selection}
//         viewport={viewport}
//         screen={screen}
//         onSelect={setSelection}
//       />
//     </ViewSection>
//   )
// })

// const ViewBasicSection: FC<{ feedback: api.FeedbackDetailed }> = ({
//   feedback
// }) => (
//   <ViewSection>
//     <ViewPairs>
//       <ViewPair label="Creation Date">
//         {feedback.creationDate.format('HH:mm, DD.MM.YYYY')}
//       </ViewPair>

//       {feedback.email.cata({
//         Nothing: () => null,

//         Just: email => (
//           <ViewPair label="Contact email">
//             <Router.Link href={`mailto:${email}`} title="Write an email">
//               {email}
//             </Router.Link>
//           </ViewPair>
//         )
//       })}

//       <ViewPair label="Source url">
//         <Router.Link href={feedback.url} title={feedback.url} target="_blank">
//           {ellipsisString(50, feedback.url)}
//         </Router.Link>
//       </ViewPair>
//     </ViewPairs>
//   </ViewSection>
// )

// const ViewBrowserSection: FC<{ browser: api.Browser }> = ({ browser }) => (
//   <ViewSection title="Browser">
//     <ViewPairs>
//       <ViewPair label="Name">{browser.name}</ViewPair>
//       <ViewPair label="Version">{browser.version}</ViewPair>
//       <ViewPair label="Platform">{browser.platform}</ViewPair>
//       <ViewPair label="Device">{browser.device}</ViewPair>
//     </ViewPairs>
//   </ViewSection>
// )

// const StyledTable = styled.table`
//   min-width: 200px;
//   font-size: 14px;

//   td {
//     padding: 2px;

//     + td {
//       padding-left: 20px;
//     }
//   }
// `

// const ViewPair: FC<{ label: ReactNode }> = ({ label, children }) => (
//   <tr>
//     <td>{label}</td>
//     <td>{children}</td>
//   </tr>
// )

// const ViewPairs: FC = ({ children }) => (
//   <StyledTable>
//     <tbody>{children}</tbody>
//   </StyledTable>
// )

// const StyledBackLink = styled.div`
//   box-sizing: border-box;
//   margin: 10px 0 0 10px;
//   padding: 5px 0;
//   flex: 1 0 auto;
// `

// const StyledInfo = styled.div`
//   display: flex;
//   flex-flow: row wrap;
//   flex: 1 1 auto;

//   @media ${breakpoints.big.minWidth} {
//     flex: 0;
//     flex-direction: column;
//   }
// `

// const StyledRoot = styled.div`
//   display: flex;
//   flex-direction: column;
//   margin: -10px 0 0 -10px;

//   @media ${breakpoints.big.minWidth} {
//     flex-flow: row nowrap;
//   }
// `

// const ViewRoot: FC<{ feedback: api.FeedbackDetailed }> = ({ feedback }) => (
//   <StyledRoot data-cy="details__root">
//     <StyledInfo>
//       <StyledBackLink>
//         <Router.Link
//           data-cy="details__link-dashboard"
//           route={Router.ToDashboard()}
//         >
//           ← Back to Dashboard
//         </Router.Link>
//       </StyledBackLink>

//       <ViewBasicSection feedback={feedback} />

//       <ViewBrowserSection browser={feedback.browser} />

//       <ViewSection title="Comment">{feedback.comment}</ViewSection>

//       <ViewScreenViewportSection
//         viewport={feedback.viewport}
//         screen={feedback.screen}
//       />
//     </StyledInfo>

//     <ViewMapSection geo={feedback.geo} />
//   </StyledRoot>
// )

// export default React.memo(ViewRoot)

const View: React.FC = () => null

export default View
