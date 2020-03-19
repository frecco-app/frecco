import React, {Component} from "react";
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';

function PostForm(props) {
    let i = 0
    let ratings = [1, 2, 3, 4, 5]
    //popuating location and categroy dropdown menu with state
    let categoryOptions = props.categories.map(el => <option key={`cat-${i++}`} value={el}>{el}</option>)
    let locationOptions = props.locations.map(el => <option key={`loc-${i++}`} value={el}>{el}</option>)
    let ratingOptions = ratings.map(el => <option key={`rat-${i++}`} value={el}>{el}</option>)

    return (
        <form id='post-form'>
            <label for="category">Select a Category:</label>
                <select onChange={props.handleChangePostCategory} id='category-dd' name='category'>
                    {categoryOptions}
                </select>
            <br/>
            <label for="locations">Select a Location:</label>
                <select onChange={props.handleChangePostLocation} id='locations-dd' name='locations'>
                    {locationOptions}
                </select>
            <br/>
            <label for="rating">Rating:</label>
                <select onChange={props.handleChangePostRating} id='rating-dd' name='locations'>
                    {ratingOptions}
                </select>
            <br/>
            <InputLabel>Recommendation</InputLabel>
            <Input onChange={props.handleChangeRecommendation} id='recommendation' name='recommendation'></Input>
            <br/>
            <InputLabel>Review</InputLabel>
            <br/>
            <TextField onChange={props.handleChangeReview} multiline rows='4' id='review' style={{width: '100%'}} />
            <br/>
            <Button onClick={props.handlePostForm}>Post</Button>
        </form>
    )
}

export default PostForm;