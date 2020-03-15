import React, {Component} from "react";
import { Link } from 'react-router-dom';


const Header3 = (props) => {
  return (
    <div id="header3">
        <input id="firstname" placeholder="First Name"/>
        <input id="lastname" placeholder="Last Name"/>
        <input id="username" placeholder="Username"/>
        <input id="password" placeholder="Password"/>
        
        <Link to='/header2'>
          <button id="btn-login">Signup</button>
        </Link>
        <Link to="/header2">
            <button id="btn-login">Login</button>
        </Link>

    </div>
  )
};

export default Header3;