import React, {Component} from "react";

function PostForm() {
    return (
        <div id='post-form'>
            <h3>Post form</h3>
            <label>City:</label>
            <input></input>
            {/* button on click submits a POST request  */}
            <br/>
            <button>Submit Post</button>
        </div>
    )
}

export default PostForm;