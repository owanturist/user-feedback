/**
 * It can't use emotion-theme with typescript due to the issue https://github.com/emotion-js/emotion/issues/1305
 * Workaround doesn't help deploy-preview-1600--emotion.netlify.app/docs/typescript#define-a-theme
 */

export type Theme = {
  primary: string
  secondary: string
  cloud: string
  dark: string
}

const theme: Theme = {
  primary: '#1ea0be',
  secondary: '#be1ea0',
  cloud: '#e5ecf2',
  dark: '#59636b'
}

export default theme
