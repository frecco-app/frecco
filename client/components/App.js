import React, {Component} from "react";
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header1 from "./Header1";
import Header2 from "./Header2";
import LeftContainer from "./LeftContainer";
import RightContainer from "./RightContainer";
import FilterForm from "./FilterForm";

class App extends Component {
    constructor (props) {
      super(props);
  }
  
  render () {
    return (
      <div>
         
        <Router>
          <Link to="/header1">Go to header1</Link>
          <Link to="/header2">Go to header2</Link>
          <Switch>
            <Route path='/header1' component={Header1}/>
            <Route path='/header2' component={Header2}/>
          </Switch>
        </Router>
        {/* taylor added */}
        <FilterForm />
        <div id='wrapper'>
          <LeftContainer />
          <RightContainer />
        </div>
      </div>
      );
    }
  }

  export default App;