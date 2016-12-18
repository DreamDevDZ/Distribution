import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { createStore } from '#/main/core/utilities/redux'

import { registerDefaultInstrumentTypes } from './types'
import instrumentReducer from './reducers'
import Instrument from './components/instrument.jsx'

// Initialize instrument app
registerDefaultInstrumentTypes()
const store = createStore(instrumentReducer, {
  instrument: {
    id: '123',
    name: 'My awesome guitar',
    type: 'piano',
    keys: 88
  }
})

ReactDOM.render(
  React.createElement(
    Provider,
    {store},
    React.createElement(Instrument)
  ),
  document.getElementById('instrument')
)
