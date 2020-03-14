import React, {Component} from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header1 from "./Header1";
import Header2 from "./Header2";

class App extends Component {
    constructor (props) {
      super(props);
  }

  render () {
    return (
      <div>
        <Router>
          <Route path='/' component={Header1}/>
          <Route path='/header2' component={Header2}/>
        </Router>
      </div>
      );
    }
  }

  export default App;