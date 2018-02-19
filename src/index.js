import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

import Game from './containers/Game'


const App = () => (
  <Game />
)


ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
