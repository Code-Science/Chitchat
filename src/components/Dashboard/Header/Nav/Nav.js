import React, {useContext, useState} from 'react';
import classes from './Nav.module.css';
import FirebaseContext from '../../../Firebase/context';
import ImageDisplay from "../ImageDisplay/ImageDisplay";
import Aux from "../../../hoc/Auxx";

const Nav = props => {

    const firebase = useContext(FirebaseContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const appliedClass = [];
    const menuIconClasses = ["fas", "fa-ellipsis-v", classes.MenuIcon];

    if(!props.requestSeen){
        appliedClass.push(classes.RequestAlert);
        menuIconClasses.push(classes.RequestAlert);
    }
    const dropdownHandler = () =>{
        setShowDropdown(showDropdown=>!showDropdown);
    }

    return (
        <Aux>
            <div className={classes.Nav} style={{backgroundColor:props.color}}>
                <p>ChitChat</p>
                <ul>
    <li><button onClick={props.switchPage}>{props.searchPageShow? <i className="fas fa-envelope"></i> : <i className="fas fa-search"></i>}</button></li>
                    <li className={classes.FriendsIcon}><i className="fas fa-user-friends" onClick={props.changeFriendsBoxDisplay}></i></li>
                    <li className={classes.Collapse}><button onClick={props.reqModal} className={appliedClass.join(" ")}>REQUESTS{props.requestSeen?"":"!"}</button></li>
                    {/* <li><button onClick={props.switchPage}>{props.searchPageShow? "MESSAGES" : "SEARCH"}</button></li> */}
                    <li className={classes.Collapse}><button onClick={firebase.doSignOut}>LOGOUT</button></li>
                    <li><i className={menuIconClasses.join(" ")} onClick={dropdownHandler}></i></li>
                    <li><ImageDisplay userData={props.userData}/></li>
                    <li><strong>{props.userData? props.userData.username.toUpperCase(): null}</strong></li>
                </ul>
            </div>
            <div className={classes.Dropdown} style={{display:showDropdown? "block":"none"}}>
                <ul>
                    <li><button onClick={props.reqModal} className={appliedClass.join(" ")}>REQUESTS{props.requestSeen?"":"!"}</button></li>
                    <li><button onClick={firebase.doSignOut}>LOGOUT</button></li>
                </ul>
            </div>
       </Aux>
    );

    
}

export default Nav;