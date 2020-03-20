import React, {Component} from "react";

function UserDashboard(props) {
    //loop through array of posts and render here when . 
//   let postCount = 0;
//   for (let i = 0; i < props.posts.length; i++) {
//     if (props.posts.username === props.username) postCount++;
//   }
  return (
        <div id='user-dashboard'>
            <h3>User Dashboard</h3>
            <p>Name: {props.name}</p>
            <p>Username: {props.username}</p>
            {/* <p>Posts : {postCount} </p> */}
        </div>
  )
}

export default UserDashboard;