import React, {Component} from "react";
import FeedItem from "./FeedItem";

function FeedContainer(props) {
    // loop through array of posts and render here 
  const feed = [];
  for (let i = 0; i < props.filteredPosts.length; i ++) {
 
    const post = props.filteredPosts[i];
    const isLiked = props.likedPosts.includes(post.id);
    
    // if (props.likedPosts.includes(post.id)) isLiked = true;
    feed.push(<FeedItem key={'feeditem'+i}
        id={post.id}
        locationDetail={post.locationDetail}
        location={post.location}
        category={post.category}
        rating={post.rating}
        recommendation={post.recommendation}
        review_text={post.review_text}
        username={post.username}
        isLiked={isLiked}
        handleLikeReview={props.handleLikeReview}
        likes={post.likes}
        numberLikes={props.numberLikes}
        //likeReview={props.likeReview}
        />);
  }
  return (
    <div id='feed-container'>
        {feed}
    </div>
  );
}

export default FeedContainer;