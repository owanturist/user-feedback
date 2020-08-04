import React, { FC } from 'react'
import { number, text } from '@storybook/addon-knobs'

import * as api from 'api'
import FeedbackTable from './index'

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
  }
]

export default {
  title: 'FeedbackTable',
  component: FeedbackTable
}

export const Initial: FC = () => <FeedbackTable items={feedbackItems} />

export const Overflowed: FC = () => (
  <FeedbackTable
    items={[
      ...feedbackItems,
      {
        id: '3',
        rating: number('rating', 10000000),
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
    ]}
  />
)
