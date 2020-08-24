import React, {useState} from 'react';
import classes from './Header.module.css';
import Nav from './Nav/Nav';
import ImageDisplay from './ImageDisplay/ImageDisplay';

const Header = props => {
    const [color , setColor] = useState('transparent');
    const changehandle = (event) =>{
        const value = event.target.value;
        setColor(value);
    }

    return (
       <div className={classes.Header}>
           <Nav color = {color}  switchPage={props.switchPage} reqModal={props.requestModal}/>
           <div className={classes.Head}>
               <ImageDisplay height='70px'/>
               <p><strong>{props.userData? props.userData.username.toUpperCase(): null}</strong></p>
               {props.requests?<p className={classes.Para}> you have {props.requests.length} friend {props.requests.length > 1 ? 'requests' : 'request'}</p> : 
            null}
           </div>
           {/* {props.requests?<p className={classes.Para}> you have {props.requests.length} friend {props.requests.length > 1 ? 'requests' : 'request'}</p> : 
            null} */}
           {/* <input type="color" id="head" name="head" onChange={changehandle} style={{marginTop: '80px'}}/> */}
       </div>
    );
}

export default Header;