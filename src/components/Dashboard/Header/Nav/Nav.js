import React, {useContext} from 'react';
import classes from './Nav.module.css';
import FirebaseContext from '../../../Firebase/context';

const Nav = props => {

    const firebase = useContext(FirebaseContext);
    return (
       <div className={classes.Nav} style={{backgroundColor:props.color}}>
           <p>CHITCHAT</p>
           <ul>
               <li><button onClick={props.reqModal}>REQUESTS</button></li>
               <li><button onClick={props.switchPage}>SEARCH</button></li>
               <li><button onClick={firebase.doSignOut}>LOGOUT</button></li>
           </ul>
       </div>
    );
}

export default Nav;