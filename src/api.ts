import axios, { AxiosResponse } from 'axios'
import dayjs, { Dayjs } from 'dayjs'
import Decode from 'frctl/Json/Decode'
import { nonEmptyString } from 'utils'

// @TODO find a way to declare variables in TS level
const API_URL = process.env.REACT_APP_API_URL || ''
const HTTP_TIMEOUT = Number(process.env.REACT_APP_HTTP_TIMEOUT)

const request = axios.create({
  baseURL: API_URL,
  timeout: HTTP_TIMEOUT
})

/**
 * Users' browser who left a feedback
 */
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

/**
 * Rating of a feedback
 * It has to be sure that we don't have rating out of bounds in UI
 */
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

/**
 * Preview of feedback to display in lists
 */
export type Feedback<C = string> = {
  id: string
  rating: Rating
  comment: C
  browser: Browser
}

const feedbackDecoder: Decode.Decoder<Feedback> = Decode.shape({
  id: Decode.field('id').string,
  rating: Decode.field('rating').of(ratingDecoder),
  comment: Decode.field('comment').string.map(str => str.trim()),
  browser: Decode.field('computed_browser').of(browserDecoder)
})

/**
 * Decodes various date formats to Dayjs instance
 */
const dayjsDecoder: Decode.Decoder<Dayjs> = Decode.oneOf([
  Decode.string.map(dayjs),

  Decode.int.map(ts => {
    if (ts.toString().length < 11) {
      // assume we cought timestamp in seconds
      // https://stackoverflow.com/a/23982005/4582383
      return dayjs(ts * 1000)
    }

    return dayjs(ts)
  })
]).chain(date =>
  date.isValid() ? Decode.succeed(date) : Decode.fail('Date is invalid.')
)

/**
 * Longitude and Latitude tuple (array) representation to be used in Mapbox
 */
export type LngLat = [number, number]

/**
 * Decodes various lng-lat formats to tuple one
 */
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
]).map(({ lng, lat }) => [lng, lat])

/**
 * Geo position of a user who left feedback
 */
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

/**
 * Viewport of a users' device
 */
export type Viewport = {
  width: number
  height: number
}

const viewportDecoder: Decode.Decoder<Viewport> = Decode.shape({
  width: Decode.field('width').int,
  height: Decode.field('height').int
})

/**
 * Screen of a users' device
 */
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

/**
 * Detailed feedback
 */
export type FeedbackDetailed = Feedback & {
  url: string
  email: null | string
  creationDate: Dayjs
  viewport: Viewport
  screen: Screen
  geo: Geo
}

const feedbackDetailedDecoder: Decode.Decoder<FeedbackDetailed> = Decode.shape({
  basic: feedbackDecoder,
  url: Decode.field('url').string,
  email: Decode.field('email').optional.string.map(email =>
    email.map(nonEmptyString).getOrElse(null)
  ),
  creationDate: Decode.field('creation_date').of(dayjsDecoder),
  viewport: Decode.field('viewport').of(viewportDecoder),
  screen: Decode.field('screen').of(screenDecoder),
  geo: Decode.field('geo').of(geoDecoder)
}).map(({ basic, ...detailed }) => ({ ...basic, ...detailed }))

/**
 * First it matches only id with target one
 * and then it case it found a match decodes detailed feedback
 * or return Nothing otherwise to handle later as 404
 *
 * @param index current index to be checked
 * @param length total size of list with feedback items
 * @param targetId id of feedback to lookup
 */
const findDetailedFeedbackByIdDecoder = (
  index: number,
  length: number,
  targetId: string
): Decode.Decoder<null | FeedbackDetailed> => {
  if (index >= length) {
    return Decode.succeed(null)
  }

  return Decode.lazy(
    // it uses lazy to keep array context after [index].id probe
    () => Decode.index(index).field('id').string
  ).chain(currentId => {
    if (targetId === currentId) {
      return Decode.index(index).of(feedbackDetailedDecoder)
    }

    return findDetailedFeedbackByIdDecoder(index + 1, length, targetId)
  })
}

/**
 * Http request builder to retrieve Array<Feedback>
 */
export const getFeedbackList = (): Promise<Array<Feedback>> => {
  return request
    .get(`/example/apidemo.json`, {
      transformResponse: body => {
        return Decode.field('items')
          .list(feedbackDecoder)
          .decodeJSON(body)
          .fold<string | Array<Feedback>>(
            decodeError => decodeError.stringify(4),
            feedback => feedback
          )
      }
    })
    .then(({ data }: AxiosResponse<string | Array<Feedback>>) => {
      if (typeof data === 'string') {
        return Promise.reject(data)
      }

      return data
    })
}

/**
 * Simulation of using api endpoint to retrieve detailed feedback
 *
 * @param feedbackId id of detailed feedback to be returned
 *
 * @returns Http request builder to retrieve Just<FeedbackDetailed>
 * when it's found or Nothing otherwise
 */
export const getFeedbackById = (
  feedbackId: string
): Promise<null | FeedbackDetailed> => {
  // keep id for e2e mocking
  return request
    .get(`/example/apidemo.json?id=${feedbackId}`, {
      transformResponse: body => {
        return Decode.field('items')
          .list(Decode.value)
          .chain(list => {
            return Decode.field('items').of(
              findDetailedFeedbackByIdDecoder(0, list.length, feedbackId)
            )
          })
          .decodeJSON(body)
          .fold<string | null | FeedbackDetailed>(
            decodeError => decodeError.stringify(4),
            feedback => feedback
          )
      }
    })
    .then(({ data }: AxiosResponse<string | null | FeedbackDetailed>) => {
      if (typeof data === 'string') {
        return Promise.reject(data)
      }

      return data
    })
}
