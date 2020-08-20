import React from 'react'
import styled from '@emotion/styled/macro'

import theme from 'theme'
import { Viewport as ViewportData, Screen as ScreenData } from 'api'
import { SkeletonRect } from 'components/Skeleton'

export enum Selection {
  None,
  Viewport,
  Screen
}

const DEFAULT_MAXIMUM_WIDTH = 300

type StyledViewportProps = {
  screen?: boolean
  dim: boolean
  dominating: boolean
}

const StyledViewport = styled.div<StyledViewportProps>`
  position: ${props => (props.dominating ? 'relative' : 'absolute')};
  z-index: ${props => (props.dim ? 1 : 2)};
  top: 0;
  left: 0;
  background: ${props => (props.screen ? theme.primary : theme.secondary)};
  border-radius: 2px;
  opacity: ${props => (props.dim ? 0.4 : 0.7)};
`

type StyledRootProps = {
  width: number
}

const StyledRoot = styled.div<StyledRootProps>`
  position: relative;
  padding: 1px;
  margin: -1px;
  width: ${props => props.width}px;
`

const ViewportScreen: React.FC<{
  selected: Selection
  viewport: ViewportData
  screen: ScreenData
  width?: number
  onSelect(selection: Selection): void
}> = React.memo(
  ({ selected, viewport, screen, width = DEFAULT_MAXIMUM_WIDTH, onSelect }) => {
    const viewportIsDominating =
      viewport.height > screen.availableTop + screen.availableHeight
    const relativePx =
      width /
      Math.max(viewport.width, screen.availableLeft + screen.availableWidth)

    const onSelectViewport = React.useCallback(
      () => onSelect(Selection.Viewport),
      [onSelect]
    )
    const onSelectScreen = React.useCallback(() => onSelect(Selection.Screen), [
      onSelect
    ])
    const onUnselect = React.useCallback(() => onSelect(Selection.None), [
      onSelect
    ])

    return (
      <StyledRoot width={width}>
        <StyledViewport
          dominating={viewportIsDominating}
          dim={selected === Selection.Screen}
          style={{
            width: Math.round(relativePx * viewport.width),
            height: Math.round(relativePx * viewport.height)
          }}
          onMouseEnter={onSelectViewport}
          onMouseLeave={onUnselect}
        />

        <StyledViewport
          screen
          dominating={!viewportIsDominating}
          dim={selected === Selection.Viewport}
          style={{
            marginTop: Math.round(relativePx * screen.availableTop),
            marginLeft: Math.round(relativePx * screen.availableLeft),
            width: Math.round(relativePx * screen.availableWidth),
            height: Math.round(relativePx * screen.availableHeight)
          }}
          onMouseEnter={onSelectScreen}
          onMouseLeave={onUnselect}
        />
      </StyledRoot>
    )
  }
)

export default ViewportScreen

export const ViewportScreenSkeleton: React.FC<{ width?: number }> = React.memo(
  ({ width = DEFAULT_MAXIMUM_WIDTH }) => (
    <StyledRoot width={width}>
      <SkeletonRect width="100%" height={Math.round((2 / 3) * width)} />
    </StyledRoot>
  )
)
