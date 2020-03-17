import React, { Component } from "react";
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import Header1 from "./Header1";
import Header2 from "./Header2";
import Header3 from "./Header3";
import LeftContainer from "./LeftContainer";
import RightContainer from "./RightContainer";
import FilterForm from "./FilterForm";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: null,
      password: null,
      firstname: null,
      lastname: null,
      loginMessage: null,
      signupMessage: null,
    };
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleChangeFirstname = this.handleChangeFirstname.bind(this);
    this.handleChangeLastname = this.handleChangeLastname.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }
  handleChangeFirstname() {
    this.setState({ firstname: event.target.value });
  }
  handleChangeLastname() {
    this.setState({ lastname: event.target.value });
  }
  handleChangeUsername() {
    this.setState({ username: event.target.value });
  }
  handleChangePassword() {
    this.setState({ password: event.target.value });
  }
  signup() {
    //post data. if successfull go to header3
    const data = { 
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      username: this.state.username,
      password: this.state.password,
    };
    console.log('signup data object',data);
    fetch('/users/signup', { 
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (!res.ok) { 
          console.log('signup error') 
          this.setState({signupMessage:'Invalid signup information.'})
        } 
        else {
          // redirect to new page
          this.props.history.push('/header2')
        }
      });
  }

  login() {
    const data = { 
      username: this.state.username,
      password: this.state.password
    };
    console.log('login fired')
    fetch('/users/login', { 
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) 
    })
      .then((res) => {
        if (!res.ok) { 
          console.log('login error') 
          this.setState({loginMessage: 'Invalid login information'})
        } 
        else {
          // redirect to new page
          this.props.history.push('/header2')
        }
      });
  }

  logout(){
    this.setState({
      username: null,
      password: null,
      firstname: null,
      lastname: null,
    })
    this.props.history.push('/')
  }

  render() {
    return (
      <div>
          <Switch>
              <Route exact path='/' render={() => 
                <Header1 message={this.state.loginMessage} login={this.login} handleChangeUsername={this.handleChangeUsername} handleChangePassword={this.handleChangePassword} />}/>
              <Route exact path='/header2' render={()=> 
                <Header2 username={this.state.username} logout={this.logout}/>}/>
              <Route exact path='/header3' render={()=> 
                <Header3 message={this.state.signupMessage} signup={this.signup} handleChangeUsername={this.handleChangeUsername} handleChangePassword={this.handleChangePassword} handleChangeFirstname={this.handleChangeFirstname} handleChangeLastname={this.handleChangeLastname}/>}/>
          </Switch>
          <FilterForm />
          <div id='wrapper'>
            <LeftContainer />
            <RightContainer />
          </div>
      </div>
    );
  }
}

export default withRouter(App);