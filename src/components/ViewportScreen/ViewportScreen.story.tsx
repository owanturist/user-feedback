import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import { number } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

import * as api from 'api'
import ViewportScreen, { Selection, ViewportScreenSkeleton } from '.'

export default {
  title: 'ViewportScreen',
  component: ViewportScreen
}

const rangeKnob = (label: string, max: number, start: number): number => {
  return number(label, start, { range: true, min: 0, max, step: 1 })
}

const viewportKnob = (viewport: api.Viewport): api.Viewport => ({
  width: rangeKnob(`Viewport Width`, 500, viewport.width),
  height: rangeKnob(`Viewport Height`, 300, viewport.height)
})

const screenKnob = (screen: api.Screen): api.Screen => ({
  availableWidth: rangeKnob(`Screen Width`, 500, screen.availableWidth),
  availableHeight: rangeKnob(`Screen Height`, 300, screen.availableHeight),
  availableLeft: rangeKnob(`Screen Left`, 100, screen.availableLeft),
  availableTop: rangeKnob(`Screen Top`, 50, screen.availableTop)
})

const StyledContainer = styled.div`
  display: inline-block;
  border: 10px solid #ccc;
`

export const Skeleton: FC = () => <ViewportScreenSkeleton />

export const ViewportIsWiderAndHigher: FC = () => (
  <StyledContainer>
    <ViewportScreen
      selected={Selection.None}
      viewport={viewportKnob({
        width: 300,
        height: 200
      })}
      screen={screenKnob({
        availableWidth: 200,
        availableHeight: 150,
        availableLeft: 20,
        availableTop: 10
      })}
      onSelect={action('onSelect')}
    />
  </StyledContainer>
)

export const ViewportIsWiderButNotHigher: FC = () => (
  <StyledContainer>
    <ViewportScreen
      selected={Selection.None}
      viewport={viewportKnob({
        width: 300,
        height: 200
      })}
      screen={screenKnob({
        availableWidth: 200,
        availableHeight: 250,
        availableLeft: 20,
        availableTop: 10
      })}
      onSelect={action('onSelect')}
    />
  </StyledContainer>
)

export const ViewportIsNotWiderButHigher: FC = () => (
  <StyledContainer>
    <ViewportScreen
      selected={Selection.None}
      viewport={viewportKnob({
        width: 300,
        height: 200
      })}
      screen={screenKnob({
        availableWidth: 400,
        availableHeight: 150,
        availableLeft: 20,
        availableTop: 10
      })}
      onSelect={action('onSelect')}
    />
  </StyledContainer>
)

export const ViewportIsNotWiderAndNotHigher: FC = () => (
  <StyledContainer>
    <ViewportScreen
      selected={Selection.None}
      viewport={viewportKnob({
        width: 300,
        height: 200
      })}
      screen={screenKnob({
        availableWidth: 400,
        availableHeight: 250,
        availableLeft: 20,
        availableTop: 10
      })}
      onSelect={action('onSelect')}
    />
  </StyledContainer>
)
