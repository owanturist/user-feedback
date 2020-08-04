export type Browser = {
  name: string
  version: string
  platform: string
  device: string
}

export type Feedback = {
  id: string
  rating: number
  comment: string
  browser: Browser
}
