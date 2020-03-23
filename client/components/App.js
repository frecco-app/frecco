import React, { Component, Fragment } from 'react';
import {
  Link, Route, Switch, withRouter
} from 'react-router-dom';
import io from 'socket.io-client';
import Header1 from './Header1';
import Header2 from './Header2';
import Header3 from './Header3';
import LeftContainer from './LeftContainer';
import RightContainer from './RightContainer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io('http://localhost:3000/'),
      user_id: null,
      username: null,
      password: null,
      firstname: null,
      lastname: null,
      loginMessage: null,
      signupMessage: null,
      posts: [],
      filteredPosts: [],
      friends: [],
      potentialFollows: [],
      postFilter: {
        location: null,
        category: null,
        minrating: 1,
        friends: []
      },
      categories: ['Attraction', 'Food', 'Accomodation', 'Activity'],
      locations: [],
      postData: {
        location: null,
        category: null,
        rating: null,
        recommendation: null,
        review_text: null
      },
      follow_user: null // {user_id: #, username: # }
    };
    // methods to handle signup/login
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleChangeFirstname = this.handleChangeFirstname.bind(this);
    this.handleChangeLastname = this.handleChangeLastname.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleChangeRating = this.handleChangeRating.bind(this);
    this.handleChangeFriendsFilter = this.handleChangeFriendsFilter.bind(this);
    // methods for fetching posts
    this.fetchPosts = this.fetchPosts.bind(this);
    this.filterPosts = this.filterPosts.bind(this);
    // methods for posting
    this.handlePostForm = this.handlePostForm.bind(this);
    this.handleChangeRecommendation = this.handleChangeRecommendation.bind(this);
    this.handleChangeReview = this.handleChangeReview.bind(this);
    this.handleChangePostRating = this.handleChangePostRating.bind(this);
    this.handleChangePostLocation = this.handleChangePostLocation.bind(this);
    this.handleChangePostCategory = this.handleChangePostCategory.bind(this);
    // methods for following
    this.handleChangeFollow = this.handleChangeFollow.bind(this);
    this.addFollow = this.addFollow.bind(this);
  }

  handleChangeFollow(e, value) {
    this.setState({ follow_user: value });
  }

  addFollow() {
    const data = { followedUser: this.state.follow_user.user_id };
    fetch('/users/follow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({ friends: [...this.state.friends, { ...this.state.follow_user }] });
        this.setState({ potentialFollows: [...this.state.potentialFollows].filter((user) => user.user_id !== json) });
        console.log('Success:', json);
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }

  componentDidMount() {
    // Attempt to connect to room (catches refreshes during session)
    this.fetchUser()
      .then(({ username }) => {
        if (username) this.state.socket.emit('room', username);
      });

    // fetch posts only once
    this.fetchPosts();
    // Handle recieved posts
    this.state.socket.on('post', (post) => {
      this.setState({
        posts: [...this.state.posts, post]
      });
      this.filterPosts();
    });
  }

  fetchUser() {
    return fetch('/users/', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then((res) => res.json());
  }

  fetchPosts() {
    fetch('/users/getreview', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          posts: json,
          filteredPosts: json
        });
        return json;
      })
      .then((json) => {
        const locations = json.reduce((acc, post) => {
          if (!acc.hasOwnProperty(post.location)) { 
            acc[post.location] = true; 
          };
          return acc;
        }, {});
        this.setState({
          locations: [...Object.keys(locations)]
        });
      });
  }

  handleChangeFirstname(event) {
    this.setState({ firstname: event.target.value });
  }

  handleChangeLastname(event) {
    this.setState({ lastname: event.target.value });
  }

  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleChangeLocation(event) {
    this.setState({ postFilter: { ...this.state.postFilter, location: event.target.value } });
  }

  handleChangeCategory(event) {
    this.setState({ postFilter: { ...this.state.postFilter, category: event.target.value } });
  }

  handleChangeRating(event) {
    this.setState({ postFilter: { ...this.state.postFilter, minrating: event.target.value } });
  }

  handleChangeFriendsFilter(event, value) {
    this.setState({ postFilter: { ...this.state.postFilter, friends: value.map((a) => a.user_id) } });
    // value.map(a => String(a.user_id))
  }

  // Post form Handles
  handleChangeRecommendation(event) {
    this.setState({ postData: { ...this.state.postData, recommendation: event.target.value } });
  }

  handleChangeReview(event) {
    this.setState({ postData: { ...this.state.postData, reviewText: event.target.value } });
  }

  handleChangePostLocation(event) {
    this.setState({ postData: { ...this.state.postData, location: event.target.value } });
  }

  handleChangePostCategory(event) {
    this.setState({ postData: { ...this.state.postData, category: event.target.value } });
  }

  handleChangePostRating(event) {
    this.setState({ postData: { ...this.state.postData, rating: event.target.value } });
  }

  // post form data to server
  handlePostForm() {
    const data = {
      username: this.state.username,
      location: this.state.postData.location,
      category: this.state.postData.category,
      rating: this.state.postData.rating,
      recommendation: this.state.postData.recommendation,
      reviewText: this.state.postData.reviewText
    };

    fetch('/users/submitreview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(() => {
        console.log('Success');
      })
      .catch(() => {
        console.error('Error');
      });
  }

  signup() {
    // post data. if successfull go to header3
    const data = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      username: this.state.username,
      password: this.state.password
    };

    fetch('/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((json) => {
        if (!(Array.isArray(json[3]) && json[3].length > 0)) {
          console.log('signup error');
          this.setState({ loginMessage: 'Invalid signup information' });
        } else {
          this.setState({ posts: json[3] });
          this.filterPosts();
          // redirect to new page
          this.props.history.push('/header2');
        }
      });
  }

  login() {
    const data = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    };
    this.state.socket.emit('room', data.username);
    
    fetch('/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        res.json()
        // /login route sends back a response body that is an array with user id, username, and firstname
          .then((json) => {
            if (!res.ok) {
              console.log('login error');
              this.setState({ loginMessage: 'Invalid login information' }); 
            }
            else {
              // redirect to new page
              this.setState({
                username: data.username,
                password: data.password,
                user_id: json[0],
                firstname: json[2]
              });
              this.props.history.push('/header2');
              this.fetchUsers(json[0])
            }
            if (!(Array.isArray(json[3]) && json[3].length > 0)) {
            console.log('login error');
            this.setState({ loginMessage: 'Invalid login information' });
            } else {
              this.setState({ posts: json[3] });
              this.filterPosts();
              // redirect to new page
              this.props.history.push('/header2');
            }
          });
      })
  }

  logout() {
    fetch('/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          console.log('logout error');
          this.setState({ loginMessage: 'Invalid logout information' });
        } else {
          this.setState({
            username: null,
            password: null,
            firstname: null,
            lastname: null,
            posts: [],
            filteredPosts: []
          });
          this.props.history.push('/');
        }
      });
    }

  fetchPosts() {
    fetch('/users/getreview', {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    })
      .then((res) => res.json())
      .then((json)=> {
        this.setState({
          posts: json,
          filteredPosts: json
        });
      })
  }

  filterPosts() {
    // filter posts to show, based on user selection
    let newfilteredPosts = this.state.posts;
    newfilteredPosts = newfilteredPosts.filter((post) => {
      let result = true;
      if (this.state.postFilter.location && (this.state.postFilter.location !== post.location)) {
        result = false;
      }
      if (this.state.postFilter.category && (this.state.postFilter.category !== post.category)) {
        result = false;
      }
      if (this.state.postFilter.minrating && (this.state.minrating > post.rating)) {
        result = false;
      }
      if (this.state.postFilter.friends.length > 0
        && !(this.state.postFilter.friends.includes(Number(post.created_by)))
      ) {
        console.log(Number(post.created_by));
        result = false;
      }
      return result;
    });
    this.setState({ filteredPosts: newfilteredPosts });
  }

  fetchUsers(user_id) {
    fetch(`users/getusers?userId=${user_id}`, {
      method: 'GET',
      headers: {
        Accept : 'application/json'
      }
    })
      .then((res) => res.json())
      .then((json) => {
        const friends = [];
        const potentialFollows = [];
        json.forEach((user) => {
          if (user.followed_user !== null) { friends.push({ 
            user_id: user.user_id, username: user.username 
          }) } 
          else { 
            console.log(user);
            potentialFollows.push({ user_id: user.id, username: user.username }) 
          }
        });
        this.setState({
          friends : friends,
          potentialFollows : potentialFollows
        });
      });
  }

  render() {
    return (
      <Fragment>
          <Switch>
              <Route exact path='/' render={() => <Header1
                message={this.state.loginMessage}
                login={this.login}
                handleChangeUsername={this.handleChangeUsername}
                handleChangePassword={this.handleChangePassword} />}
              />
              <Route exact path='/header2' render={() => <Header2
                username={this.state.username}
                logout={this.logout}/>}
              />
              <Route exact path='/header3' render={() => <Header3
                message={this.state.signupMessage}
                signup={this.signup}
                handleChangeUsername={this.handleChangeUsername}
                handleChangePassword={this.handleChangePassword}
                handleChangeFirstname={this.handleChangeFirstname}
                handleChangeLastname={this.handleChangeLastname} />}
              />
          </Switch>
          <div id='wrapper'>
            <LeftContainer
            postData={this.state.postData}
            handleChangePostCategory={this.handleChangePostCategory}
            handleChangePostLocation={this.handleChangePostLocation}
            handleChangePostRating={this.handleChangePostRating}
            handleChangeRecommendation={this.handleChangeRecommendation}
            handleChangeReview={this.handleChangeReview}
            handlePostForm={this.handlePostForm}
            categories={this.state.categories}
            locations={this.state.locations} 
            potentialFollows={this.state.potentialFollows} 
            handleChangeFollow={this.handleChangeFollow} 
            addFollow={this.addFollow}
            username = {this.state.username}
            firstname = {this.state.firstname}
            />
            <RightContainer 
             filterPosts={this.filterPosts}
             filteredPosts={this.state.filteredPosts}
             handleChangeCategory={this.handleChangeCategory}
             handleChangeLocation={this.handleChangeLocation}
             handleChangeRating={this.handleChangeRating}
             location={this.state.postFilter.location}
             category={this.state.postFilter.category}
             minrating={this.state.postFilter.minrating}
             friends={this.state.friends}
             handleChangeFriendsFilter={this.handleChangeFriendsFilter}
             categories={this.state.categories} 
             locations={this.state.locations}
             postFilter={this.state.postFilter}
             />
          </div>
      </Fragment>
    );
  }
}

export default withRouter(App);
