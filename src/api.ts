export type Browser = {
  name: string
  version: string
  platform: string
  device: string
}

// It has to be sure that we don't have rating out of bounds in UI
export enum Rating {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5
}

export type Feedback = {
  id: string
  rating: Rating
  comment: string
  browser: Browser
}
