import * as types from '../constants/actionTypes'

export const handleChangePostCategory = (category) => ({
    type: types.HC_POST_CATEGORY,
    payload: category.target.value
})

export const handleChangePostLocation = (structuredFormatting) => ({
    type: types.HC_POST_LOCATION,
    payload: structuredFormatting.target.value
})

export const handleChangePostRating = (rating) => ({
    type: types.HC_POST_RATING,
    payload: rating.target.value
})

export const handleChangeRecommendation = (recommendation) => ({
    type: types.HC_RECOMMENDATION,
    payload: recommendation.target.value
})

export const handleChangeReview = (review) => ({
    type: types.HC_REVIEW,
    payload: review.target.value
})

// export const handlePostForm = () => ({
//     type: types.H_POST_FORM,
//     payload: null
// });

// using redux-thunk
export const handlePostForm = () => {
    return (dispatch, getState) => {
        console.log(getState())
        const state = getState().frecco;
        const data = {
            username: state.username,
            location: state.postData.location,
            category: state.postData.category,
            rating: state.postData.rating,
            recommendation: state.postData.recommendation,
            reviewText: state.postData.reviewText
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
}

// export const handleChangeFollow = (follow_user) => ({
//     type: types.HC_FOLLOW,
//     payload: follow_user
// })

// export const addFollow = () => ({
//     type: types.ADD_FOLLOW,
//     payload:
// })