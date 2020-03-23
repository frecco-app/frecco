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
      potentialFollows: [
        { user_id: 5, username: 'Dunkin' },
        { user_id: 6, username: 'Donuts' },
        { user_id: 21, username: 'draco' },
        { user_id: 8, username: 'Hut' }
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
        review_text: null
      },
      follow_user: null, // {user_id: #, username: # },
      likedPosts: []
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
    // like or unlike a post
    this.handleLikeReview = this.handleLikeReview.bind(this);
    //this.likeReview = this.handleLikeReview.bind(this);
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
    this.fetchFriends();

    // fetch likes
    this.fetchLikes();

    // Handle recieved posts
    this.state.socket.on('post', (post) => {
      this.setState({
        posts: [...this.state.posts, post]
      });
      this.filterPosts();
    });


  }

  componentWillUnmount() {
    clearInterval(this.timer);
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
      });
  }

  fetchLikes() {
    fetch('/users/getlikes', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          likedPosts: json
        });
      });
  }

  // Will have a button on the FeedItem component
  handleLikeReview(event, int, bool) {
    const data = { review_id: int, isLiked: bool };
    fetch('/users/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => res.json())
    .then(this.fetchLikes())
    .catch((err) => console.error(err));
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
            addFollow={this.addFollow}/>
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
             likedPosts={this.state.likedPosts}
             handleLikeReview={this.handleLikeReview}
             />
          </div>
      </Fragment>
    );
  }
}

export default withRouter(App);
