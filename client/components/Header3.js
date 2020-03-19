import React, {Component} from "react";
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

const Header3 = (props) => {
  return (
    <div id="header3">
        <Input id="firstname" placeholder="First Name" onChange={props.handleChangeFirstname}/>
        &nbsp;&nbsp;<Input id="lastname" placeholder="Last Name" onChange={props.handleChangeLastname}/>
        &nbsp;&nbsp;<Input id="username" placeholder="Username" onChange={props.handleChangeUsername}/>
        &nbsp;&nbsp;<Input id="password" type="password" placeholder="Password" onChange={props.handleChangePassword}/>
        &nbsp;&nbsp;<Button id="btn-submit" onClick={props.signup}>Signup</Button>
        <span>  {props.message}</span>
    </div>
  )
};

export default Header3;