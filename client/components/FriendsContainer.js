import React, {Component} from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';

function FriendsContainer(props) {
    //loop through array of posts and render here. 
    return (
        <div id='friends-container'>
            <Autocomplete
                id="follow" 
                options={props.potentialFollows} 
                getOptionLabel={option => option.username}
                renderInput={params => (
                    <TextField {...params} label="Follow" margin="normal" variant="outlined"/>
                )} 
                onChange={(e,value) => props.handleChangeFollow(e,value)}
            />
            <Button style={{ height : 30 }} onClick={props.addFollow} variant='contained'>Follow</Button>
        </div>
    )
}

export default FriendsContainer;