import React from 'react'
import { number, text } from '@storybook/addon-knobs'

import { Feedback } from 'api'
import { fragmentize } from 'utils'
import { FeedbackTableItem, FeedbackTable, FeedbackTableSkeleton } from '.'

const addFragment = (
  pattern: string,
  feedback: Feedback
): FeedbackTableItem => ({
  ...feedback,
  comment: fragmentize(pattern, feedback.comment) || []
})

const feedbackItems: Array<Feedback> = [
  {
    id: '0',
    rating: 2,
    comment: 'belle offre de services',
    browser: {
      name: 'Chrome',
      version: '32.0',
      device: 'Desktop',
      platform: 'MacOSX'
    }
  },
  {
    id: '1',
    rating: 4,
    comment: 'bouton ne fonctionne pas',
    browser: {
      name: 'Firefox',
      version: '16.0',
      device: 'Desktop',
      platform: 'MacOSX'
    }
  },
  {
    id: '2',
    rating: 1,
    comment: '',
    browser: {
      name: 'IE',
      version: 'v9',
      device: 'Desktop',
      platform: 'WinXP'
    }
  }
]

export default {
  title: 'FeedbackTable'
}

export const Skeleton: React.FC = () => (
  <FeedbackTableSkeleton count={number('Count', 10)} />
)

export const Empty: React.FC = () => <FeedbackTable items={[]} />

export const CSRF: React.FC = () => (
  <FeedbackTable
    items={[
      {
        id: '0',
        rating: 2,
        comment: '<script>alert("You are hacked!")</script>',
        browser: {
          name: 'Chrome',
          version: '32.0',
          device: 'Desktop',
          platform: 'MacOSX'
        }
      }
    ].map(item => addFragment('', item))}
  />
)

export const Normal: React.FC = () => (
  <FeedbackTable items={feedbackItems.map(item => addFragment('', item))} />
)

export const Overflowed: React.FC = () => {
  const search = text('Search', '')

  return (
    <FeedbackTable
      items={[
        ...feedbackItems,
        {
          id: '3',
          rating: number('Rating', 10000000),
          comment: text(
            'Comment',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at mauris gravida, scelerisque nibh id, dapibus turpis. Mauris et vestibulum lacus, vitae ultricies augue. Phasellus id sapien vel ligula posuere pretium. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut posuere est ut risus ullamcorper, molestie ullamcorper nulla tempor. Duis semper sed tortor sed fermentum. Integer accumsan fringilla rhoncus.'
          ),
          browser: {
            name: text('Browser name', 'Aliquam eget aliquam turpis'),
            version: text('Browser version', '123.91238.1327312.3'),
            device: text(
              'Browser device',
              'Nullam turpis eros, mattis quis convallis nec, dictum quis quam'
            ),
            platform: text(
              'Browser platform',
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
            )
          }
        }
      ].map(item => addFragment(search, item))}
    />
  )
}
