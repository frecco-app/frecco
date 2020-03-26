import React from 'react';
import Button from '@material-ui/core/Button';

const HeaderMainPage = (props) => {
  return (
    <div id="header2">
        <h1>Frecco 2.0</h1>
        <div>Welcome to Frecco, {props.username}!</div>
        <Button variant="outlined" color="primary" id="btn-logout" onClick={props.logout}>Logout</Button>
    </div>
  );
};

export default HeaderMainPage;
