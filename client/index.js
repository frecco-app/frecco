import React from 'react'
import App from './App'
import { render } from 'react-dom'
import styles from './stylesheets/styles.scss'
import { Router } from 'react-router-dom';
import history from './components/history';

render(<Router history={history}><App /></Router>, document.getElementById('root'));
