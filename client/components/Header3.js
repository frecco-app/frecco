import React, {Component} from "react";
import { Link } from 'react-router-dom';


const Header3 = (props) => {
  return (
    <div id="header3">
        <input id="firstname" placeholder="First Name"/>
        <input id="lastname" placeholder="Last Name"/>
        <input id="username" placeholder="Username"/>
        <input id="password" placeholder="Password"/>
        <button id="btn-submit" onClick={props.signup}>Submit</button>
        <Link to="/">
            <button id="btn-login">Login</button>
        </Link>

    </div>
  )
};

export default Header3;