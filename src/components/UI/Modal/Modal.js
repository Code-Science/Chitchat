import React from 'react';
import classes from './Modal.module.css';
import Aux from '../../../components/hoc/Auxx';
import Backdrop from '../Backdrop/Backdrop';

const Modal = (props) =>{
    return (
        <Aux>
            <div style={{
                transform: props.show? 'translateY(0)': 'translateY(-100vh)',
                opacity: props.show? '1':'0'
            }} className={classes.Modal}>
                {props.children}
            </div>
            <Backdrop show={props.show} clicked={props.click}/>
        </Aux>
    );
}

export default Modal;