import '../src/index.css'

import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { addDecorator } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

addDecorator(withKnobs)
addDecorator(next => <MemoryRouter>{next()}</MemoryRouter>)
