import React, {Component} from "react";

function UserDashboard(props) {
    //loop through array of posts and render here. 
    return (
        <div id='user-dashboard'>
            <h3>User Dashboard</h3>
            <p>Name: {props.firstname}</p>
            <p>Username: {props.username}</p>
        </div>
    )
}

export default UserDashboard;