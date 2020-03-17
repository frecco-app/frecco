import React, { Component } from "react";
import { Link } from 'react-router-dom';


const Header2 = (props) => {
  return (
        <div id="header2">
            <div>Welcome to Explore Genie, {props.username}!</div>
            <button id="btn-logout" onClick={props.logout}>Logout</button>
        </div>
  )
};

export default Header2;