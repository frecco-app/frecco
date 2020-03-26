import React from 'react';

import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import App from './App';
// import styles from './stylesheets/styles.scss';
import history from './components/history';
import store from './store';

render(<Provider store= {store}><Router history={history}><App /></Router></Provider>, document.getElementById('root'));
