import React, {Component} from "react";
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';

function PostForm(props) {
    let i = 0
    let categoryOptions = []
    let locationOptions = []
    //popuating location and categroy dropdown menu with state
    props.categories.map(el => categoryOptions.push(<option key={`cat-${i++}`} value=''>{el}</option>))
    props.locations.map(el => locationOptions.push(<option key={`loc-${i++}`} value=''>{el}</option>))

    return (
        <form id='post-form'>
            <label htmlFor="category">Select a Category:</label>
                <select id='category-dd' name='category'>
                    {categoryOptions}
                </select>
            <br/>
            <label htmlFor="locations">Select a Location:</label>
                <select id='locations-dd' name='locations'>
                    {locationOptions}
                </select>
            <br/>
            <label htmlFor="rating">Rating:</label>
                <select id='rating-dd' name='locations'>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                </select>
            <br/>
            <InputLabel>Recommendation</InputLabel>
            <Input id='recommendation' name='recommendation'></Input>
            <br/>
            <br/>
            <InputLabel>Review</InputLabel>
            <br/>
            <TextField multiline rows='4' id='review' style={{width: '100%'}} />
            <br/>
            <Button onClick={props.handlePostForm}>Post</Button>
        </form>
    )
}

export default PostForm;