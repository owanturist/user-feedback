import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled/macro'
import * as Skeleton from 'Skeleton'

import * as api from 'api'

const StyledLabel = styled.div`
  font-weight: 600;

  @media (min-width: 1025px) {
    display: none;
  }
`

const StyledItemProperty = styled.div`
  padding: 10px;
  min-width: 100px;

  @media (min-width: 481px) {
    text-align: center;
  }

  @media (min-width: 1025px) {
    display: table-cell;
    vertical-align: middle;
    padding: 26px 40px;
  }
`

const StyledItemComment = styled(StyledItemProperty)`
  order: 10; /* move comment to the end */

  @media (min-width: 481px) {
    text-align: left;
    width: 100%;
  }

  @media (min-width: 1025px) {
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
    <ViewItemProperty label="Rating">{item.rating}</ViewItemProperty>

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

const StyledHeader = styled.th`
  display: none;
  color: #e5ecf2;
  background: #59636b;
  text-align: center;
  font-weight: bold;
  font-size: 18px;

  td {
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

type ViewFeedbackProps = {
  items: Array<api.Feedback>
}

const ViewFeedback: FC<ViewFeedbackProps> = ({ items }) => (
  <StyledRoot>
    <StyledHeader>
      <td>Rating</td>
      <td className="text-left">Comment</td>
      <td>Browser</td>
      <td>Device</td>
      <td>Platform</td>
    </StyledHeader>

    {items.map(item => (
      <ViewItem key={item.id} item={item} />
    ))}
  </StyledRoot>
)

const Feedback: FC<
  | (SkeletonProps & { skeleton: true })
  | (ViewFeedbackProps & { skeleton?: false })
> = props => {
  if (props.skeleton) {
    return <SkeletonFeedback count={props.count} />
  }

  return <ViewFeedback items={props.items} />
}

export default Feedback

// S K E L E T O N

const SkeletonItemProperty: FC = () => (
  <ViewItemProperty label={<Skeleton.Text />}>
    <Skeleton.Text />
  </ViewItemProperty>
)

const SkeletonItem: FC = () => (
  <StyledItem>
    <SkeletonItemProperty />

    <StyledItemComment>
      <StyledLabel>
        <Skeleton.Text />
      </StyledLabel>
      <Skeleton.Text />
    </StyledItemComment>

    <SkeletonItemProperty />

    <SkeletonItemProperty />

    <SkeletonItemProperty />
  </StyledItem>
)

type SkeletonProps = {
  count?: number
}

const SkeletonFeedback: FC<SkeletonProps> = ({ count = 1 }) => (
  <StyledRoot>
    <StyledHeader>
      <td>
        <Skeleton.Text />
      </td>
      <td className="text-left">
        <Skeleton.Text />
      </td>
      <td>
        <Skeleton.Text />
      </td>
      <td>
        <Skeleton.Text />
      </td>
      <td>
        <Skeleton.Text />
      </td>
    </StyledHeader>

    {count > 0
      ? new Array(count).fill(0).map((_, i) => <SkeletonItem key={i} />)
      : null}
  </StyledRoot>
)
