import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled/macro'

import * as Skelet from 'Skeleton'
import * as Rating from 'Rating'
import * as api from 'api'

const StyledLabel = styled.div`
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 18px;

  @media (min-width: 1025px) {
    display: none;
  }
`

const StyledItemProperty = styled.div`
  padding: 10px;
  min-width: 100px;

  @media (min-width: 1025px) {
    display: table-cell;
    padding: 26px 40px;
    vertical-align: middle;
    text-align: center;
  }
`

const StyledItemComment = styled(StyledItemProperty)`
  order: 10; /* move comment to the end */

  @media (min-width: 481px) {
    text-align: left;
    width: 100%;
  }
`

const ViewItemProperty: FC<{
  label: ReactNode
}> = ({ label, children }) => (
  <StyledItemProperty>
    <StyledLabel>{label}</StyledLabel>
    {children}
  </StyledItemProperty>
)

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  color: #59636b;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  @media (min-width: 481px) {
    flex-flow: row wrap;
    justify-content: space-between;
  }

  @media (min-width: 1025px) {
    display: table-row;
    border-radius: 0;
    box-shadow: none;
    overflow: auto;
  }

  & + & {
    margin-top: 20px;

    @media (min-width: 1025px) {
      ${StyledItemComment},
      ${StyledItemProperty} {
        border-top: 2px solid #f8f8f8;
      }
    }
  }
`

const ViewItem: FC<{ item: api.Feedback }> = ({ item }) => (
  <StyledItem>
    <ViewItemProperty label="Rating">
      <Rating.Static rating={item.rating} />
    </ViewItemProperty>

    <StyledItemComment>
      <StyledLabel>Comment</StyledLabel>
      {item.comment}
    </StyledItemComment>

    <ViewItemProperty label="Browser">
      {item.browser.name}
      <br />
      {item.browser.version}
    </ViewItemProperty>

    <ViewItemProperty label="Device">{item.browser.device}</ViewItemProperty>

    <ViewItemProperty label="Platform">
      {item.browser.platform}
    </ViewItemProperty>
  </StyledItem>
)

const StyledHeaderCell = styled.div`
  display: table-cell;
`

const StyledHeader = styled.div`
  display: none;
  color: #e5ecf2;
  background: #59636b;
  text-align: center;
  font-weight: bold;
  font-size: 18px;

  ${StyledHeaderCell} {
    min-width: 100px;
    padding: 26px 40px 20px;
  }

  .text-left {
    text-align: left;
  }

  @media (min-width: 1025px) {
    display: table-row;
  }
`

const StyledRoot = styled.div`
  width: 100%;
  word-break: break-word;

  @media (min-width: 1025px) {
    display: table;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
  }
`

export const View: FC<{
  className?: string
  items: Array<api.Feedback>
}> = ({ className, items }) => (
  <StyledRoot className={className}>
    <StyledHeader>
      <StyledHeaderCell>Rating</StyledHeaderCell>
      <StyledHeaderCell className="text-left">Comment</StyledHeaderCell>
      <StyledHeaderCell>Browser</StyledHeaderCell>
      <StyledHeaderCell>Device</StyledHeaderCell>
      <StyledHeaderCell>Platform</StyledHeaderCell>
    </StyledHeader>

    {items.map(item => (
      <ViewItem key={item.id} item={item} />
    ))}
  </StyledRoot>
)

// S K E L E T O N

const SkeletonItemProperty: FC = () => (
  <ViewItemProperty label={<Skelet.Text />}>
    <Skelet.Text />
  </ViewItemProperty>
)

const SkeletonItem: FC = () => (
  <StyledItem>
    <ViewItemProperty label={<Skelet.Text />}>
      <Rating.Skeleton inline />
    </ViewItemProperty>

    <StyledItemComment>
      <StyledLabel>
        <Skelet.Text />
      </StyledLabel>
      <Skelet.Text count={2} />
    </StyledItemComment>

    <SkeletonItemProperty />

    <SkeletonItemProperty />

    <SkeletonItemProperty />
  </StyledItem>
)

export const Skeleton: FC<{
  className?: string
  count?: number
}> = ({ className, count = 1 }) => (
  <StyledRoot className={className}>
    <StyledHeader>
      <StyledHeaderCell>
        <Skelet.Text />
      </StyledHeaderCell>
      <StyledHeaderCell className="text-left">
        <Skelet.Text />
      </StyledHeaderCell>
      <StyledHeaderCell>
        <Skelet.Text />
      </StyledHeaderCell>
      <StyledHeaderCell>
        <Skelet.Text />
      </StyledHeaderCell>
      <StyledHeaderCell>
        <Skelet.Text />
      </StyledHeaderCell>
    </StyledHeader>

    {count > 0
      ? new Array(count).fill(0).map((_, i) => <SkeletonItem key={i} />)
      : null}
  </StyledRoot>
)
