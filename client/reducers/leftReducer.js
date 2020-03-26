import * as types from '../constants/actionTypes';

const initialState = {
  username: null,
  firstname: null,
  postLocationMessage: null,
  posts: [],
  potentialFollows: [],
  postData: {
    location: null,
    category: null,
    rating: null,
    recommendation: null,
    review_text: null
  }
};

const leftReducer = (state=initialState, action) => {
  let username = state.username
  let firstname = state.firstname
  let postLocationMessage = state.postLocationMessage
  let posts = state.posts.slice();
  let potentialFollows = state.potentialFollows.slice();
  let postData = {...state.postData};

  switch(action.type) {
    case types.HC_POST_CATEGORY:
      return {
        ...state,
        postData:{
          ...state.postData,
          category: action.payload
        }
      }

    case types.HC_POST_LOCATION:
      const structuredFormatting = action.payload;
      console.log(structuredFormatting);
      console.log("post location")
      return {
        ...state,
        postLocationMessage: null,
        postData: {
          ...state.postData, 
          location: `${structuredFormatting.main_text}   ${structuredFormatting.secondary_text}` 
        }
      }
    case types.HC_POST_RATING:
      return {
        ...state,
        postData: {
          ...state.postData,
          rating: action.payload
        }
      }

    case types.HC_RECOMMENDATION:
      return {
        ...state,
        postData: {
          ...state.postData,
          recommendation: action.payload
        }
      }

    case types.HC_REVIEW:
      return {
        ...state,
        postData: {
          ...state.postData,
          reviewText: action.payload
        }
      }


    case types.H_POST_FORM:
      const data = {
        username: username,
        location: postData.location,
        category: postData.category,
        rating: postData.rating,
        recommendation: postData.recommendation,
        reviewText: postData.reviewText
      };
      console.log("posting form")
    
      return {
        ...state
      };

    default:
      return state;
  }
};

export default leftReducer;


// handlePostForm() {
//     console.log('location to go with post request', this.state.postData.location);
//     const data = {
//       username: this.state.username,
//       location: this.state.postData.location,
//       category: this.state.postData.category,
//       rating: this.state.postData.rating,
//       recommendation: this.state.postData.recommendation,
//       reviewText: this.state.postData.reviewText
//     };

//     fetch('/users/submitreview', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     })
//       .then(() => {
//         console.log('Success');
//       })
//       .catch(() => {
//         console.error('Error');
//       });
//   }

// handleChangeRecommendation(event) {
//     this.setState({ postData: { ...this.state.postData, recommendation: event.target.value } });
//   }

//   handleChangeReview(event) {
//     this.setState({ postData: { ...this.state.postData, reviewText: event.target.value } });
//   }

// handleChangePostRating(event) {
//     this.setState({ postData: { ...this.state.postData, rating: event.target.value } });
//   }

// handleChangePostCategory(event) {
//     this.setState({ postData: { ...this.state.postData, category: event.target.value } });
//   }

//   handleChangePostLocation(event, value) {
//     // if (!value.structured_formatting.hasOwnProperty('secondary_text')) {
//     //   this.setState({ postLocationMessage: 'Please specify a more specific location' });
//     // }
//     this.setState({ postLocationMessage: null });
//     this.setState({ postData: { ...this.state.postData, location: `${value.structured_formatting.main_text}   ${value.structured_formatting.secondary_text}` } });
//   }