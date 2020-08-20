import React, { FC, ReactNode } from 'react'
import styled from '@emotion/styled/macro'

import theme from 'theme'
import * as breakpoints from 'breakpoints'
import { Feedback } from 'api'
import { Fragment } from 'utils'
import { toDetails, Link } from 'Router'
import * as Skeleton from 'components/Skeleton'
import { RatingMarkStatic, RatingMarkSkeleton } from 'components/RatingMark'
import { ReactComponent as EmptyTableIcon } from './empty-table.svg'

export type FeedbackTableItem = Feedback<Array<Fragment>>

const StyledLabel = styled.div`
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 18px;

  @media ${breakpoints.big.minWidth} {
    display: none;
  }
`

const StyledItemProperty = styled.div`
  padding: 20px;
  min-width: 100px;

  @media ${breakpoints.big.minWidth} {
    display: table-cell;
    padding: 26px 40px;
    vertical-align: middle;
    text-align: center;
  }
`

const StyledItemComment = styled(StyledItemProperty)`
  order: 10; /* move comment to the end */

  @media ${breakpoints.small.minWidth} {
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

const StyledEmptyComment = styled.span`
  font-style: italic;
  color: #aaa;
`

const StyledMatchedFragment = styled.span`
  color: #000;
  background: rgb(255, 253, 59);
`

const ViewFragments: FC<{
  fragments: Array<Fragment>
}> = ({ fragments }) =>
  fragments.length === 0 ? (
    <StyledEmptyComment>Empty comment</StyledEmptyComment>
  ) : (
    <>
      {fragments.map((fragment, i) =>
        fragment.matched ? (
          <StyledMatchedFragment key={i}>
            {fragment.slice}
          </StyledMatchedFragment>
        ) : (
          <React.Fragment key={i}>{fragment.slice}</React.Fragment>
        )
      )}
    </>
  )

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  color: ${theme.dark};
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  @media ${breakpoints.small.minWidth} {
    flex-flow: row wrap;
    justify-content: space-between;
  }

  @media ${breakpoints.big.minWidth} {
    display: table-row;
    border-radius: 0;
    box-shadow: none;
    overflow: auto;
  }

  & + & {
    margin-top: 20px;

    @media ${breakpoints.big.minWidth} {
      ${StyledItemComment},
      ${StyledItemProperty} {
        border-top: 2px solid #f8f8f8;
      }
    }
  }
`

const StyledItemLink = styled(StyledItem)`
  text-decoration: inherit;
  color: inherit;

  &:hover {
    background: #fafafa;
  }
`.withComponent(Link)

const ViewItem: FC<{
  item: FeedbackTableItem
}> = React.memo(({ item }) => (
  <StyledItemLink data-cy="feedback-table__item" to={toDetails(item.id)}>
    <ViewItemProperty label="Rating">
      <RatingMarkStatic rating={item.rating} />
    </ViewItemProperty>

    <StyledItemComment>
      <StyledLabel>Comment</StyledLabel>
      <ViewFragments fragments={item.comment} />
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
  </StyledItemLink>
))

const StyledHeaderCell = styled.div`
  display: table-cell;
`

const StyledHeader = styled.div`
  display: none;
  color: ${theme.cloud};
  background: ${theme.dark};
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

  @media ${breakpoints.big.minWidth} {
    display: table-row;
  }
`

const ViewHeader: FC = React.memo(() => (
  <StyledHeader>
    <StyledHeaderCell>Rating</StyledHeaderCell>
    <StyledHeaderCell className="text-left">Comment</StyledHeaderCell>
    <StyledHeaderCell>Browser</StyledHeaderCell>
    <StyledHeaderCell>Device</StyledHeaderCell>
    <StyledHeaderCell>Platform</StyledHeaderCell>
  </StyledHeader>
))

const StyledEmptyTableIcon = styled(EmptyTableIcon)`
  display: block;
  margin: 0 auto 5px;
  width: 80px;
`

const StyledEmpty = styled.div`
  padding: 50px;
  background: #fff;
  border-radius: 5px;
  color: ${theme.dark};
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
  text-align: center;
`

const ViewEmpty: FC<{ className?: string }> = React.memo(({ className }) => (
  <StyledEmpty className={className}>
    <StyledEmptyTableIcon />
    No Data
  </StyledEmpty>
))

const StyledRoot = styled.div`
  width: 100%;
  word-break: break-word;

  @media ${breakpoints.big.minWidth} {
    display: table;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
  }
`

export const FeedbackTable: FC<{
  className?: string
  items: Array<FeedbackTableItem>
}> = React.memo(({ className, items }) =>
  items.length > 0 ? (
    <StyledRoot className={className}>
      <ViewHeader />

      {items.map(item => (
        <ViewItem key={item.id} item={item} />
      ))}
    </StyledRoot>
  ) : (
    <ViewEmpty className={className} />
  )
)

// S K E L E T O N

const SkeletonItemProperty: FC = () => (
  <ViewItemProperty label={<Skeleton.Text />}>
    <Skeleton.Text />
  </ViewItemProperty>
)

const SkeletonItem: FC = React.memo(() => (
  <StyledItem>
    <ViewItemProperty label={<Skeleton.Text />}>
      <RatingMarkSkeleton inline />
    </ViewItemProperty>

    <StyledItemComment>
      <StyledLabel>
        <Skeleton.Text />
      </StyledLabel>
      <Skeleton.Text count={2} />
    </StyledItemComment>

    <SkeletonItemProperty />

    <SkeletonItemProperty />

    <SkeletonItemProperty />
  </StyledItem>
))

export const FeedbackTableSkeleton: FC<{
  className?: string
  count?: number
}> = React.memo(({ className, count = 1 }) => (
  <StyledRoot className={className}>
    <StyledHeader>
      <StyledHeaderCell>
        <Skeleton.Text />
      </StyledHeaderCell>
      <StyledHeaderCell className="text-left">
        <Skeleton.Text />
      </StyledHeaderCell>
      <StyledHeaderCell>
        <Skeleton.Text />
      </StyledHeaderCell>
      <StyledHeaderCell>
        <Skeleton.Text />
      </StyledHeaderCell>
      <StyledHeaderCell>
        <Skeleton.Text />
      </StyledHeaderCell>
    </StyledHeader>

    {count > 0
      ? new Array(count).fill(0).map((_, i) => <SkeletonItem key={i} />)
      : null}
  </StyledRoot>
))
