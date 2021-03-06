import React, { ReactNode } from 'react'
import styled from '@emotion/styled/macro'
import { css } from 'emotion/macro'

import theme from 'theme'
import breakpoints from 'breakpoints'
import { SkeletonText, SkeletonRect } from 'components/Skeleton'
import { ViewportScreenSkeleton } from 'components/ViewportScreen'

// V I E W

export const cssMap = css`
  flex: 1 0 auto;
  margin-top: 15px;
`

export const StyledSectionTitle = styled.h3`
  margin: 0 0 16px;
  color: #333;
  font-weight: 600;
  font-size: 18px;
`

export const StyledSection = styled.section`
  flex: 1 1 auto;
  margin: 10px 0 0 10px;
  padding: 20px;
  border-radius: 3px;
  color: ${theme.dark};
  background: #fff;
  box-shadow: 0 5px 5px -5px rgba(0, 0, 0, 0.2);
  word-break: break-word;
`

export const ViewSection: React.FC<{ title?: ReactNode }> = ({
  title,
  children
}) => (
  <StyledSection>
    {title && <StyledSectionTitle>{title}</StyledSectionTitle>}
    {children}
  </StyledSection>
)

type StyledViewportMarkerProps = {
  dim: boolean
}

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

export const ViewPairs: React.FC = ({ children }) => (
  <StyledTable>
    <tbody>{children}</tbody>
  </StyledTable>
)

export const StyledBackLink = styled.div`
  box-sizing: border-box;
  margin: 10px 0 0 10px;
  padding: 5px 0;
  flex: 1 0 auto;
`

export const StyledInfo = styled.div`
  display: flex;
  flex-flow: row wrap;
  flex: 1 1 auto;

  @media ${breakpoints.big.minWidth} {
    flex: 0;
    flex-direction: column;
  }
`

export const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  margin: -10px 0 0 -10px;

  @media ${breakpoints.big.minWidth} {
    flex-flow: row nowrap;
  }
`

// S K E L E T O N

const SkeletonPairs: React.FC<{ count: number }> = React.memo(({ count }) => (
  <ViewPairs>
    {new Array(count).fill(null).map((_, i) => (
      <tr key={i}>
        <td>
          <SkeletonText />
        </td>
      </tr>
    ))}
  </ViewPairs>
))

export const LayoutSkeleton: React.FC = () => (
  <StyledRoot data-cy="details__skeleton">
    <StyledInfo>
      <StyledBackLink>
        <SkeletonText />
      </StyledBackLink>

      <ViewSection>
        <SkeletonPairs count={3} />
      </ViewSection>

      <ViewSection title={<SkeletonText />}>
        <SkeletonPairs count={4} />
      </ViewSection>

      <ViewSection title={<SkeletonText />}>
        <ViewportScreenSkeleton />
      </ViewSection>
    </StyledInfo>

    <ViewSection title={<SkeletonText />}>
      <SkeletonPairs count={2} />

      <SkeletonRect className={cssMap} width="100%" height="450px" />
    </ViewSection>
  </StyledRoot>
)
