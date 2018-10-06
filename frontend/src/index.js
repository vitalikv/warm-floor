import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import configureStore from './store/configureStore'
import App from './containers/App'

import 'url-polyfill'

import './css/style.less'
import './css/simplebar.css'

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);


if (process.env.NODE_ENV === 'production') {
  let cons = {};
  for (let i in console) {
    cons[i] = function () { }
  }
  window.console = cons;
}