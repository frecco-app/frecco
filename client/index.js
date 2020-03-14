import React, { forwardRef } from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers/index';
import Root from './components/Root';

const store = createStore(
  reducers,
  composeWithDevTools()
);

render(<Root store={store} />, document.getElementById('root'));