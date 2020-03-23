import React, {Component} from "react";
import LocationSearch from './LocationSearch';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

function PostForm(props) {
    let i = 0
    let ratings = [1, 2, 3, 4, 5]
    //popuating location and categroy dropdown menu with state
    let categoryOptions = props.categories.map(el => <MenuItem key={`cat-${i++}`} value={el}>{el}</MenuItem>)
    let ratingOptions = ratings.map(el => <MenuItem key={`rat-${i++}`} value={el}>{el}</MenuItem>)

    return (
        <div>
            <div id='post-form-header'>
                <h3>Create a post</h3>
            </div>
            <form id='post-form'>
                <div id='ff-dd'>
                    <LocationSearch handleChangePostLocation={props.handleChangePostLocation} postData={props.postData} />
                    <div id='postLocationMessage'>{props.postLocationMessage}</div>
                    &nbsp;&nbsp;
                    <FormControl style={{minWidth: 120}}>
                        <InputLabel>Category</InputLabel>
                        <Select value={props.postData.category ? props.postData.category  : ""} onChange={props.handleChangePostCategory} id='locations-dd'>
                            {categoryOptions}
                        </Select>
                    </FormControl>
                    &nbsp;&nbsp;
                    <FormControl style={{minWidth: 120}}>
                        <InputLabel>Rating</InputLabel>
                        <Select value={props.postData.rating ? props.postData.rating : ""} onChange={props.handleChangePostRating} id='locations-dd'>
                            {ratingOptions}
                        </Select>
                    </FormControl>
                    &nbsp;&nbsp;
                </div>
                <div id='ff-rec'>
                    <InputLabel>Recommendation</InputLabel>
                    <TextField 
                    onChange={props.handleChangeRecommendation} 
                    id='recommendation' 
                    variant="outlined"
                    fullWidth></TextField>
                </div>
                <div id='ff-rec'>
                    <InputLabel>Review</InputLabel>
                    <TextField 
                    onChange={props.handleChangeReview} 
                    multiline 
                    rows='4' 
                    id='review' 
                    style={{width: '100%'}}
                    variant="outlined" />
                    <Button onClick={props.handlePostForm}>Post</Button>
                </div>
            </form>
        </div>
    )
}

export default PostForm;