import setup  from './game'
import { render, h } from 'preact'
import App from './App'


setup()
render(<App />, document.querySelector('#App'))