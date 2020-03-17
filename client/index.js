import React, { forwardRef } from 'react'
import App from './components/App'
import { render } from 'react-dom'
import styles from './stylesheets/styles.scss'
import { Link, BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import history from './components/history';

render(<Router ><App history={history} /></Router>, document.getElementById('root'));
