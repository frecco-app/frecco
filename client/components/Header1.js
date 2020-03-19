import React, {Component} from "react";
import { Link, withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
const Header1 = (props) => {
  return (
    <div id="header1">
        <Input id="username" variant="outlined" placeholder="username" onChange={props.handleChangeUsername}/>
        &nbsp;&nbsp;
        <Input id="password" type="password" variant="outlined" placeholder="login" onChange={props.handleChangePassword}/>
        <Button id="btn-login" onClick={props.login}>Login</Button>
        <Link to="/header3">
          <Button id="btn-signup">Signup</Button>
        </Link>
        <span>  {props.message}</span>
    </div>
  )
};

export default Header1;