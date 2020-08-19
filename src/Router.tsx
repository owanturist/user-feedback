import { Link as RouterLink } from 'react-router-dom'
import styled from '@emotion/styled/macro'

import theme from 'theme'

export const toDashboard = '/'

export const toDetails = (feedbackId: string): string => {
  return `/details/${feedbackId}`
}
toDetails.pattern = toDetails(':feedbackId')

export const Link = styled(RouterLink)`
  color: ${theme.primary};
`
