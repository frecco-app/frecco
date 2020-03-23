import React, {Component} from "react";

function UserDashboard(props) {
  //  loop through array of posts and render here when . 
  let postCount = 0;
  let ratingSum = 0;
  const locations = {};
  let locationCount = 0;
  for (let i = 0; i < props.posts.length; i++) {
    const post = props.posts[i];
    if (post.username === props.username) {
      postCount++;
      ratingSum += post.rating;
      if (locations[post.location] === undefined) {
        locations[post.location] = true;
        locationCount += 1;
      }
    }
  }
  const avgRating = ratingSum / postCount;
  return (
    <div>
      <h3>User Dashboard</h3>
      <div id='user-dashboard'>
            <span id = 'user-dashboard-left'>
               <p>Name: {props.firstname}</p>
               <p>Username: {props.username}</p>
               <p>Followed Users: {props.friends}</p>

            </span>
            <span id = 'user-dashboard-right'>
                <p>Posts : {postCount} </p>
                <p>Average Rating: {avgRating}</p>
                <p>Locations Visited: {locationCount}</p>
            </span>
          </div>
    </div>
 
  )
}

export default UserDashboard;