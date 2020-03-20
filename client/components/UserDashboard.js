import React, {Component} from "react";

function UserDashboard(props) {
    //loop through array of posts and render here. 
    return (
        <div id='user-dashboard'>
            <h3>User Dashboard</h3>
            <h4>Username: {props.username}</h4>
            <h4>Name: {props.name}</h4>
        </div>
    )
}

export default UserDashboard;