import React from 'react';
import classes from './BodyBackground.module.css';
import Dashboard from '../Dashboard/Dashboard';
import img from '../../assets/back.jpg';

const BodyBackground = () => {
    return(
       <div className={classes.BodyBackground} >
           <img src={img} className={classes.Back} />
           <Dashboard />
       </div>
    );
}

export default BodyBackground;

//style={{backgroundImage:'url('+img+')'}