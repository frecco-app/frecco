import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import App from './App';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// uncomment so that webpack can bundle styles
// import styles from './scss/application.scss';

// wrapping Router inside Provider gives Router access to "store"
// "App" will be rendered if URL matches '/'
const Root = ({ store }) => (
    <Provider store={store}>
    <Router>
      <Route path="/:filter?" component={App} />
    </Router>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root;