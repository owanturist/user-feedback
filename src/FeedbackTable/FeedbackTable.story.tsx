import React, { FC } from 'react'
import { number, text } from '@storybook/addon-knobs'

import * as api from 'api'
import * as utils from 'utils'
import * as FeedbackTable from './index'

const addFragment = (
  pattern: string,
  item: api.Feedback
): [Array<utils.Fragment>, api.Feedback] => [
  utils.fragmentize(pattern, item.comment).getOrElse([]),
  item
]

const feedbackItems: Array<api.Feedback> = [
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

export const Skeleton: FC = () => (
  <FeedbackTable.Skeleton count={number('Count', 10)} />
)

export const Empty: FC = () => <FeedbackTable.View items={[]} />

export const CSRF: FC = () => (
  <FeedbackTable.View
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

export const Normal: FC = () => (
  <FeedbackTable.View
    items={feedbackItems.map(item => addFragment('', item))}
  />
)

export const Overflowed: FC = () => {
  const search = text('Search', '')

  return (
    <FeedbackTable.View
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
