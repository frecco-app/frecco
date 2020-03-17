import React, {Component} from "react";
import { Link } from 'react-router-dom';


const Header3 = (props) => {
  return (
    <div id="header3">
        <input id="firstname" placeholder="First Name" onChange={props.handleChangeFirstname}/>
        <input id="lastname" placeholder="Last Name" onChange={props.handleChangeLastname}/>
        <input id="username" placeholder="Username" onChange={props.handleChangeUsername}/>
        <input id="password" placeholder="Password" onChange={props.handleChangePassword}/>
        <button id="btn-submit" onClick={props.signup}>Signup</button>
        <span>  {props.message}</span>
    </div>
  )
};

export default Header3;