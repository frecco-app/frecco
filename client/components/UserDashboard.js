import React, {Component} from "react";

function UserDashboard(props) {
  //  loop through array of posts and render here when . 
  let postCount = 0;
  let ratingSum = 0;
  for (let i = 0; i < props.posts.length; i++) {
    if (props.posts[i].username === props.username) {
      postCount++;
      ratingSum += props.posts[i].rating;
    }
  }
  let avgRating = ratingSum / postCount;
  return (
    <div>
      <h3>User Dashboard</h3>
      <div id='user-dashboard'>
            <span id = 'user-dashboard-left'>
               <p>Name: {props.firstname}</p>
               <p>Username: {props.username}</p>
               <p>Posts : {postCount} </p>
            </span>
            <span id = 'user-dashboard-right'>
                <p>Average Rating: {avgRating}</p>
            </span>
          </div>
    </div>
 
  )
}

export default UserDashboard;