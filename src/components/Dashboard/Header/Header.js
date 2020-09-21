import React from 'react';
import classes from './Header.module.css';
import Nav from './Nav/Nav';

const Header = props => {

    return (
       <div className={classes.Header}>
           <Nav switchPage={props.switchPage} 
               reqModal={props.requestModal} 
               searchPageShow={props.searchPageShow} 
               userData={props.userData} 
               requestSeen={props.requestSeen}
               changeFriendsBoxDisplay={props.changeFriendsBoxDisplay} />
       </div>
    );
}

export default Header;