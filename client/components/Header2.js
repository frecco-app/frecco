import React, { Component } from "react";
import { Link } from 'react-router-dom';


const Header2 = (props) => {
  return (
        <div id="header2">
            <div>{"Username"}</div>
            <Link to="/">
                <button id="btn-logout">Logout</button>
            </Link>
        </div>
  )
};

export default Header2;