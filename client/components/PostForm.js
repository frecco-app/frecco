import React, {Component} from "react";



function PostForm(props) {
    let i = 0
    let categoryOptions = []
    let locationOptions = []
    //popuating location and categroy dropdown menu with state
    props.categories.map(el => categoryOptions.push(<option key={`cat-${i++}`} value=''>{el}</option>))
    props.locations.map(el => locationOptions.push(<option key={`loc-${i++}`} value=''>{el}</option>))

    return (
        <form id='post-form'>
            <label for="category">Select a Category:</label>
                <select id='category-dd' name='category'>
                    {categoryOptions}
                </select>
            <br/>
            <label for="locations">Select a Location:</label>
                <select id='locations-dd' name='locations'>
                    {locationOptions}
                </select>
            <br/>
            <label for="rating">Rating:</label>
                <select id='rating-dd' name='locations'>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                </select>
            <br/>
            <label for='recommendation'>Recommendation:</label>
            <input id='recommendation' name='recommendation'></input>
            <br/>
            <label for='review'>Review:</label><br/>
            <textarea id='review' name='review' rows='5' cols='80'></textarea>
            <br/>
            <input type='button' value='Post Review' onClick={props.handlePostForm} />
        </form>
    )
}

export default PostForm;