import React from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

function FeedItem(props) {
  let heartIcon;
  !props.isLiked
    ? (heartIcon = (
        <AiOutlineHeart
          onClick={event =>
            props.handleLikeReview(event, props.id, props.isLiked)
          }
          style={{ cursor: 'pointer' }}
        />
      ))
    : (heartIcon = (
        <AiFillHeart
          onClick={event =>
            props.handleLikeReview(event, props.id, props.isLiked)
          }
          style={{ cursor: 'pointer' }}
        />
      ));
  return (

        <div className='feed-item'>
            <div className='feed-item-top-container'>
                 <span className='feed-item-prop'> <span className='bold'>{`${props.locationDetail}, `}</span>{props.location}</span>
                 <span className='feed-item-prop'> Category: {props.category} </span>
            </div>
            <div className='feed-item-mid-container' >{props.recommendation}</div> 
            <div className='feed-item-bottom-container'>
                <span className='feed-item-prop'> Reviewed by: {props.username} </span>
                <span className='feed-item-prop'> Rating: {props.rating} </span>
            </div>
            <div className = 'review-text-box'>
                {props.review_text}
            </div>
            {heartIcon}  {props.likes} likes 
            &nbsp;&nbsp; 
            {props.current_username === props.username &&
            <button id={props.id} onClick={props.handleDeleteReview}>Delete</button>}
        </div>
    )

}

export default FeedItem;
