import { combineReducers } from 'redux';

// import all reducers here
import leftReducer from './leftReducer';

// combine reducers
const reducers = combineReducers({
  // if we had other reducers, they would go here
  frecco: leftReducer
});

export default reducers;
