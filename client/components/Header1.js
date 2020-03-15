import React, {Component} from "react";
import { Link } from 'react-router-dom';


const Header1 = (props) => {
  return (
    <div id="header1">
        <input id="username" placeholder="username" onChange={props.handleChangeUsername}/>
        <input id="password" login="login" onChange={props.handleChangePassword}/>
        <Link to="/header2">
            <button id="btn-login" onClick={props.login}>Login</button>
        </Link>
        <Link to="/header3">
            <button id="btn-signup" onClick={props.signup}>Signup</button>
        </Link>
    </div>
  )
};

export default Header1;