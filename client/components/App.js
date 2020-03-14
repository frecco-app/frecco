import React, {Component} from "react";
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import Header1 from "./Header1";
import Header2 from "./Header2";

class App extends Component {
    constructor (props) {
      super(props);
  }
  
  render () {
    return (
      <div>
        <Link to="/header1">Go to header1</Link>
        <Link to="/header2">Go to header2</Link>
        <Router>
          <Route path='/header1' component={Header1}/>
          <Route path='/header2' component={Header2}/>
        </Router>
      </div>
      );
    }
  }

  export default App;