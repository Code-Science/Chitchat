import React from 'react';
import classes from './Spinner.module.css'

const Spinner = (props) => <div className={classes.Loader} style={{marginTop:props.top}}>Loading...</div>

export default Spinner;