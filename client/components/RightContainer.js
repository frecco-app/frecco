import React, {Component} from "react";
import PostForm from "./PostForm";
import FeedContainer from "./FeedContainer";

class RightContainer extends React.Component {
   
    render() {
        return (
            <div id='right-container'>
                <FeedContainer />
            </div>
            
        )
    }
}

export default RightContainer;