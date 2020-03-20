import React, { Component } from "react";
import Button from '@material-ui/core/Button';

const Header2 = (props) => {
  return (
        <div id="header2">
             <h1>frecco</h1>
            <div>Welcome to Frecco, {props.username}!</div>
            <Button id="btn-logout" onClick={props.logout}>Logout</Button>
        </div>
  )
};

export default Header2;