import Decode from 'frctl/Json/Decode'
import * as Http from 'frctl/Http'

const API_URL = process.env.REACT_APP_API_URL || ''

export type Browser = {
  name: string
  version: string
  platform: string
  device: string
}

const browserDecoder: Decode.Decoder<Browser> = Decode.shape({
  name: Decode.field('Browser').string,
  version: Decode.field('Version').string,
  platform: Decode.field('Platform').string,
  device: Decode.succeed('Desktop') // @TODO decode device somehow
})

// It has to be sure that we don't have rating out of bounds in UI
export enum Rating {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5
}

const ratingDecoder: Decode.Decoder<Rating> = Decode.enums([
  [1, Rating.One],
  [2, Rating.Two],
  [3, Rating.Three],
  [4, Rating.Four],
  [5, Rating.Five]
])

export type Feedback = {
  id: string
  rating: Rating
  comment: string
  browser: Browser
}

const feedbackDecoder: Decode.Decoder<Feedback> = Decode.shape({
  id: Decode.field('id').string,
  rating: Decode.field('rating').of(ratingDecoder),
  comment: Decode.field('comment').string.map(str => str.trim()),
  browser: Decode.field('computed_browser').of(browserDecoder)
})

export const getFeedback = Http.get(`${API_URL}/example/apidemo.json`)
  .withTimeout(5000)
  .withExpectJson(Decode.field('items').list(feedbackDecoder))
