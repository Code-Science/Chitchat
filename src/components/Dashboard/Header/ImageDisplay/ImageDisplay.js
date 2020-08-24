import React from 'react';
import classes from './ImageDisplay.module.css';
import pic from '../../../../assets/user.jpg';

const ImageDisplay = props => {
    return (
        <div className={classes.ImageDisplay} style={{height:props.height}}>
            <img src={pic} />
        </div>
    );
}

export default ImageDisplay;

