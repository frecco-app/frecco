import React, {Component} from "react";
import { Link, withRouter } from 'react-router-dom';


const Header1 = (props) => {
  return (
    <div id="header1">
        <input id="username" placeholder="username" onChange={props.handleChangeUsername}/>
        <input id="password" login="login" onChange={props.handleChangePassword}/>
        <button id="btn-login" onClick={props.login}>Login</button>
        <Link to="/header3">
          <button id="btn-signup">Signup</button>
        </Link>
        <span>  {props.message}</span>
    </div>
  )
};

export default Header1;