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
      username: null,
      password: null,
      firstname: null,
      lastname: null,
      loginMessage: null,
      signupMessage: null,
      posts: [],
      filteredPosts: [],
      friends: [
        { user_id: 1, username: 'Tom' },
        { user_id: 2, username: 'Jerry' },
        { user_id: 3, username: 'Marcus' },
        { user_id: 4, username: 'Aurelius' }
      ],
      postFilter: {
        location: null,
        category: null,
        minrating: 1,
        friends: []
      },
      categories: ['Attraction', 'Food', 'Accomodation'],
      locations: ['Paris', 'Texas', 'Taylors Condo'],
      postData: {
        location: null,
        category: null,
        rating: null,
        recommendation: null,
        reviewText: null
      }
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
    this.fetch = this.fetchPosts.bind(this);
    this.filterPosts = this.filterPosts.bind(this);
    // methods for posting
    this.handlePostForm = this.handlePostForm.bind(this);
    this.handleChangeRecommendation = this.handleChangeRecommendation.bind(this);
    this.handleChangeReview = this.handleChangeReview.bind(this);
    this.handleChangePostRating = this.handleChangePostRating.bind(this);
    this.handleChangePostLocation = this.handleChangePostLocation.bind(this);
    this.handleChangePostCategory = this.handleChangePostCategory.bind(this);
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
    console.log('hand', this.state.postFilter.friends);
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
      .then((res) => {
        console.log('Success');
      })
      .catch((err) => {
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
      .then((res) => {
        if (!res.ok) {
          console.log('signup error');
          this.setState({ signupMessage: 'Invalid signup information.' });
        } else {
          // redirect to new page
          this.props.history.push('/header2');
        }
      });
  }

  login() {
    const data = {
      username: this.state.username,
      password: this.state.password
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
        if (!res.ok) {
          console.log('login error');
          this.setState({ loginMessage: 'Invalid login information' });
        } else {
          // redirect to new page
          this.props.history.push('/header2');
        }
      });
  }

  logout() {
    this.setState({
      username: null,
      password: null,
      firstname: null,
      lastname: null
    });
    this.props.history.push('/');
  }

  componentDidMount() {
    this.state.socket.on('post', (post) => console.log(post));
    // fetch posts only once, then fetch again every 20 seconds
    this.fetchPosts();
    this.fetchFriends();
    // this.timer = setInterval(() => this.fetchPosts(),5000)
  }

  componentWillUnmount() {
    clearInterval(this.timer);
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
      });
  }

  filterPosts() {
    // filter posts to show, based on user selection
    let newfilteredPosts = this.state.posts;
    console.log('postFilter:', this.state.postFilter.friends.length > 0);
    console.log('postFilter:', this.state.postFilter.friends.includes(1));
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

  fetchFriends() {
    fetch('users/getFriends', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          friends: json
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
                handleChangeUsername={(event) => this.handleChangeUsername(event)}
                handleChangePassword={(event) => this.handleChangePassword(event)} />}
              />
              <Route exact path='/header2' render={() => <Header2
                username={this.state.username}
                logout={this.logout}/>}
              />
              <Route exact path='/header3' render={() => <Header3
                message={this.state.signupMessage}
                signup={this.signup}
                handleChangeUsername={(event) => this.handleChangeUsername(event)}
                handleChangePassword={(event) => this.handleChangePassword(event)}
                handleChangeFirstname={(event) => this.handleChangeFirstname(event)}
                handleChangeLastname={(event) => this.handleChangeLastname(event)}/>}
              />
          </Switch>
          <div id='wrapper'>
            <LeftContainer
              postData={this.state.postData}
              handleChangePostCategory={(event) => this.handleChangePostCategory(event)}
              handleChangePostLocation={(event) => this.handleChangePostLocation(event)}
              handleChangePostRating={(event) => this.handleChangePostRating(event)}
              handleChangeRecommendation={(event) => this.handleChangeRecommendation(event)}
              handleChangeReview={(event) => this.handleChangeReview(event)}
              handlePostForm={(event) => this.handlePostForm(event)}
              categories={this.state.categories}
              locations={this.state.locations}
            />
            <RightContainer
              filterPosts={this.filterPosts}
              filteredPosts={this.state.filteredPosts}
              handleChangeCategory={(event) => this.handleChangeCategory(event)}
              handleChangeLocation={(event) => this.handleChangeLocation(event)}
              handleChangeRating={(event) => this.handleChangeRating(event)}
              location={this.state.postFilter.location}
              category={this.state.postFilter.category}
              minrating={this.state.postFilter.minrating}
              friends={this.state.friends}
              handleChangeFriendsFilter={(event) => this.handleChangeFriendsFilter(event)}
             />
          </div>
      </Fragment>
    );
  }
}

export default withRouter(App);
