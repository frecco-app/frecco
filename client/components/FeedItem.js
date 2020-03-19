import React from 'react';

function FeedItem(props) {
    return (
        <div className='feed-item'>
          
            <div className='feed-item-top-container'>
                 <span className='feed-item-prop'> {props.location} </span>
                 <span className='feed-item-prop'> Category: {props.category} </span>
            </div>
            <strong>{props.recommendation}</strong> 
            <div className='feed-item-top-container'>
                <span className='feed-item-prop'> Reviewed by: {props.username} </span>
                <span className='feed-item-prop'> Rating: {props.rating} </span>
            </div>
            {props.review_text}           
        </div>
    )

}


export default FeedItem;