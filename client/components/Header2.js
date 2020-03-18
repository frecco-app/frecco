import React, { Component } from "react";
import Button from '@material-ui/core/Button';

const Header2 = (props) => {
  return (
        <div id="header2">
            <div>Welcome to Explore Genie, {props.username}!</div>
            <Button id="btn-logout" onClick={props.logout}>Logout</Button>
        </div>
  )
};

export default Header2;