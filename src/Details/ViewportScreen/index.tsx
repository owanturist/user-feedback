import React, { FC } from 'react'
import styled from '@emotion/styled/macro'

import * as api from 'api'

export enum Selection {
  None,
  Viewport,
  Screen
}

const DEFAULT_MAXIMUM_WIDTH = 300

type StyledViewportProps = {
  screen?: boolean
  dim: boolean
  dominate: boolean
}

const StyledViewport = styled.div<StyledViewportProps>`
  position: ${props => (props.dominate ? 'relative' : 'absolute')};
  z-index: ${props => (props.dim ? 1 : 2)};
  top: 0;
  left: 0;
  background: ${props => (props.screen ? '#1ea0be' : '#be1ea0')};
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

const Viewport: FC<{
  selected: Selection
  viewport: api.Viewport
  screen: api.Screen
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
          dominate={viewportIsDominating}
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
          dominate={!viewportIsDominating}
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

export default Viewport
