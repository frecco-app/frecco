import React from 'react';
import uuid from 'uuid';
import FeedItem from './FeedItem';

/**
 * Loops through posts & renders each post component.
 */

function FeedContainer(props) {
  const feed = [];
  for (let i = 0; i < props.filteredPosts.length; i++) {
    const post = props.filteredPosts[i];
    const isLiked = props.likedPosts.includes(post.id);

    // if (props.likedPosts.includes(post.id)) isLiked = true;
    feed.push(
      <FeedItem
        key={uuid.v4()}
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
      />
    );
  }
  return <div id="feed-container">{feed}</div>;
}

export default FeedContainer;
