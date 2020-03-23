import React, {Component} from "react";
import FeedItem from "./FeedItem";

function FeedContainer(props) {
    //loop through array of posts and render here. 
    const feed = [];
    for (let i = 0; i < props.filteredPosts.length; i ++) {
      const post = props.filteredPosts[i];
      feed.push(<FeedItem key={'feeditem'+i}
        locationDetail={post.locationDetail} 
        location={post.location}
        category={post.category}
        rating={post.rating}
        recommendation={post.recommendation}
        review_text={post.review_text}
        username={post.username}
        />);
    }
    return (
        <div id='feed-container'>
            {feed}
        </div>
    )
}

export default FeedContainer;