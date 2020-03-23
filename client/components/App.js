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
      postLocationMessage: null,
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
      follow_user: null, // {user_id: #, username: # },
      likedPosts: [],
      numberLikes: null // drilling this down to rerender
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
    this.parseLocation = this.parseLocation.bind(this);
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

    // fetch likes
    //this.fetchLikes();

    // Handle recieved posts
    this.state.socket.on('post', (post) => {
      post = this.parseLocation(post);
      this.setState({
        posts: [post, ...this.state.posts]
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
  parseLocation(post) {
    const locationArr = post.location.split('   ');
    const location = locationArr.length === 1 ? locationArr[0] : locationArr[1];
    const newPost = {...post, location: location}
    newPost['locationDetail'] = locationArr.length === 1 ? '' : locationArr[0];
    return newPost;
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
        return json.map((post) => this.parseLocation(post));
      })
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
          }
          return acc;
        }, {});
        this.setState({
          locations: [...Object.keys(locations)]
        });
      });
  }

  fetchLikes() {
  //  console.log('before fetch ' + this.state.likedPosts.length);
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

        })
  //     console.log('after fetch ' + this.state.likedPosts.length);
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
      .then(() => {
        this.fetchLikes();
        // get updated # of likes on current pots
        const currPostLikes = this.state.posts.filter(el => el.id === int).likes;
        this.setState({numberLikes: currPostLikes})
      });
      //  this.filterPosts();
    
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

  handleChangePostLocation(event, value) {
    if (!value.structured_formatting.hasOwnProperty('secondary_text')) {
      this.setState({ postLocationMessage: 'Please specify a more specific location' });
    }
    this.setState({ postLocationMessage: null });
    this.setState({ postData: { ...this.state.postData, location: `${value.structured_formatting.main_text}   ${value.structured_formatting.secondary_text}` } });
  }

  handleChangePostCategory(event) {
    this.setState({ postData: { ...this.state.postData, category: event.target.value } });
  }

  handleChangePostRating(event) {
    this.setState({ postData: { ...this.state.postData, rating: event.target.value } });
  }

 

  // post form data to server
  handlePostForm() {
    console.log('location to go with post request', this.state.postData.location);
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
          const posts = json[3].map(post => this.parseLocation(post))
          this.setState({ posts: posts });
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
            } else {
              // redirect to new page
              this.setState({
                username: data.username,
                password: data.password,
                user_id: json[0],
                firstname: json[2]
              });
              this.props.history.push('/header2');
              this.fetchUsers(json[0]);
            }
            if (!(Array.isArray(json[3]) && json[3].length > 0)) {
              console.log('login error');
              this.setState({ loginMessage: 'Invalid login information' });
            } else {
              const posts = json[3].map(post => this.parseLocation(post))
              this.setState({ posts: posts });
              this.filterPosts();
              this.fetchLikes();
              // redirect to new page
              this.props.history.push('/header2');
            }
          });
      });
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
        Accept: 'application/json'
      }
    })
      .then((res) => res.json())
      .then((json) => {
        const friends = [];
        const potentialFollows = [];
        json.forEach((user) => {
          if (user.followed_user !== null) {
            friends.push({
              user_id: user.user_id, username: user.username
            });
          } else {
            potentialFollows.push({ user_id: user.id, username: user.username });
          }
        });
        this.setState({
          friends,
          potentialFollows
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
              <Route exact path='/header2' render={() => 
                <Fragment>
                  <Header2 username={this.state.username} logout={this.logout}/>
                  <div id='wrapper'>
                    <LeftContainer
                      postData={this.state.postData}
                      handleChangePostCategory={this.handleChangePostCategory}
                      handleChangePostLocation={this.handleChangePostLocation}
                      postLocationMessage={this.state.postLocationMessage} 
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
                      likedPosts={this.state.likedPosts}
                      handleLikeReview={this.handleLikeReview}
                    />
                  </div>
                </Fragment>
              }
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
      </Fragment>
    );
  }
}

export default withRouter(App);
