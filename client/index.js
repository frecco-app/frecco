import React, { forwardRef } from 'react'
import App from './components/App'
import { render } from 'react-dom'
import styles from './stylesheets/styles.scss'
import { Link, Router, Route, Switch, withRouter } from 'react-router-dom';
import history from './components/history';

render(<Router history={history}><App /></Router>, document.getElementById('root'));
