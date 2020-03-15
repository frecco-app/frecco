import React, { Component } from "react";
import { Link, BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import axios from 'axios';
import Header1 from "./Header1";
import Header2 from "./Header2";
import Header3 from "./Header3";
import LeftContainer from "./LeftContainer";
import RightContainer from "./RightContainer";
import FilterForm from "./FilterForm";
import history from './history';

class App extends Component {
  constructor() {
    super()
    this.state = {
      username: null,
      password: null
    };
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }
  handleChangeUsername() {
    this.setState({ username: event.target.value });
  }
  handleChangePassword() {
    this.setState({ password: event.target.value });
  }
  signup() {
    //console.log(this.props.history);
    const data = { 
      username: this.state.username,
      password: this.state.password
    };
    // axios.post('http://localhost:3000/signup', data)
    //   .then((res) => {
    //     if (!res.ok) { console.log('signup error') } 
    //   });
  }
  login() {
    console.log('Check: login called')
  }
  render() {
    return (
      <div>
        <Router history={history}>
          <Switch>
            <Route exact path='/' render={() => <Header1 signup={this.signup} login={this.login} handleChangeUsername={this.handleChangeUsername} handleChangePassword={this.handleChangePassword}/>}/>
            <Route path='/header2' component={Header2}/>
            <Route path='/header3' component={Header3}/>
          </Switch>
        </Router>
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