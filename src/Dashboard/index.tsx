import React, { FC } from 'react'
import styled from '@emotion/styled/macro'
import { Cmd } from 'frctl'
import RemoteData from 'frctl/RemoteData'

import * as api from 'api'
import { Dispatch } from 'Provider'
import * as utils from 'utils'

// M O D E L

export type Model = {
  feedback: RemoteData<string, Array<api.Feedback>>
}

export const initial: Model = {
  feedback: RemoteData.Loading
}

// U P D A T E

export type Msg = utils.Msg<[Model], [Model, Cmd<Msg>]>

// V I E W

const StyledIcon = styled.span`
  box-sizing: border-box;
  border: 3px solid;
  border-radius: 50%;
  width: 27px;
  height: 27px;
`

const StyledHeader = styled.header`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  padding: 19px 10px;
  color: rgb(94, 98, 100);
  background: #fff;
  box-shadow: 0 0 2px 2px #dadee0;
  user-select: none;
`

const StyledPageTitle = styled.h1`
  margin: 0 0 0 15px;
  font-weight: 600;
  font-size: 26px;
  letter-spacing: 0.02em;
`

const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

export const View: FC<{
  model: Model
  dispatch: Dispatch<Msg>
}> = ({ model }) => (
  <StyledRoot>
    <StyledHeader>
      {/* @TODO Add svg icon */}
      <StyledIcon />
      <StyledPageTitle>Dashboard</StyledPageTitle>
    </StyledHeader>
  </StyledRoot>
)
