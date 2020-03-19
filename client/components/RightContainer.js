import React, {Component} from "react";
import PostForm from "./PostForm";
import FeedContainer from "./FeedContainer";

class RightContainer extends React.Component {
   
    render() {
        return (
            <div id='right-container'>
                <PostForm 
                handlePostForm={this.props.handlePostForm}
                categories={this.props.categories}
                locations={this.props.locations} />
                <FeedContainer />
            </div>
            
        )
    }
}

export default RightContainer;