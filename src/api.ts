import dayjs, { Dayjs } from 'dayjs'
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

export const getFeedbackList = Http.get(`${API_URL}/example/apidemo.json`)
  .withTimeout(5000)
  .withExpectJson(Decode.field('items').list(feedbackDecoder))

const dayjsDecoder: Decode.Decoder<Dayjs> = Decode.oneOf([
  Decode.string.map(dayjs),

  Decode.int.map(ts => {
    if (ts.toString().length > 11) {
      // assume we cought timestamp in seconds
      // https://stackoverflow.com/a/23982005/4582383
      return dayjs(ts * 1000)
    }

    return dayjs(ts)
  })
]).chain(date =>
  date.isValid() ? Decode.succeed(date) : Decode.fail('Date is invalid.')
)

export type LngLat = {
  lng: number
  lat: number
}

const lngLatDecoder: Decode.Decoder<LngLat> = Decode.oneOf([
  // lon/lat object notation
  Decode.shape({
    lng: Decode.field('lon').float,
    lat: Decode.field('lat').float
  }),

  // lng/lat object notation
  Decode.shape({
    lng: Decode.field('lng').float,
    lat: Decode.field('lat').float
  }),

  // [lng, lat] notation
  Decode.shape({
    lng: Decode.index(0).float,
    lat: Decode.index(1).float
  })
])

export type Geo = {
  country: string
  city: string
  position: LngLat
}

const geoDecoder: Decode.Decoder<Geo> = Decode.shape({
  country: Decode.field('country').string,
  city: Decode.field('city').string,
  position: lngLatDecoder
})

export type Viewport = {
  width: number
  height: number
}

const viewportDecoder: Decode.Decoder<Viewport> = Decode.shape({
  width: Decode.field('width').int,
  height: Decode.field('height').int
})

export type Screen = {
  availableTop: number
  availableLeft: number
  availableWidth: number
  availableHeight: number
}

const screenDecoder: Decode.Decoder<Screen> = Decode.shape({
  availableTop: Decode.field('availTop').int,
  availableLeft: Decode.field('availLeft').int,
  availableWidth: Decode.field('availWidth').int,
  availableHeight: Decode.field('availHeight').int
})

export type FeedbackDetailed = Feedback & {
  email: string
  url: string
  creationDate: Dayjs
  viewport: Viewport
  screen: Screen
  geo: Geo
}

const feedbackDetailedDecoder: Decode.Decoder<FeedbackDetailed> = Decode.shape({
  basic: feedbackDecoder,
  email: Decode.field('email').string,
  url: Decode.field('url').string,
  creationDate: Decode.field('creation_date').of(dayjsDecoder),
  viewport: Decode.field('viewport').of(viewportDecoder),
  screen: Decode.field('screen').of(screenDecoder),
  geo: Decode.field('geo').of(geoDecoder)
}).map(({ basic, ...detailed }) => ({ ...basic, ...detailed }))

// it matches to target id and then decodes
const findDetailedFeedbackByIdDecoder = (
  index: number,
  feedbackId: string
): Decode.Decoder<FeedbackDetailed> => {
  return Decode.index(index)
    .field('id')
    .string.chain(currentFeedbackId => {
      if (feedbackId === currentFeedbackId) {
        return feedbackDetailedDecoder
      }

      return findDetailedFeedbackByIdDecoder(index + 1, feedbackId)
    })
}

export const getFeedbackById = (
  feedbackId: string
): Http.Request<FeedbackDetailed> => {
  // keep id for e2e mocking
  return Http.get(`${API_URL}/example/apidemo.json?id=${feedbackId}`)
    .withTimeout(5000)
    .withExpectJson(
      Decode.field('items').of(findDetailedFeedbackByIdDecoder(0, feedbackId))
    )
}
