import React from 'react';

function FeedItem(props) {
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
        </div>
    )

}


export default FeedItem;