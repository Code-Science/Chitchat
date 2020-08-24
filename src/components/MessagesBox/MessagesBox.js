import React, {useState, useContext} from 'react';
import classes from './MessagesBox.module.css';
import FirebaseContext from '../../components/Firebase/context';
import img from '../../assets/pinkRose.jpg';

const MessagesBox = (props) => {
    const firebase = useContext(FirebaseContext);
    // const messageUnknown = (event) => {
    //     event.preventDefault();
    //     firebase.db.ref(`unknownMessages/${}/${uid}`).set({
    //         name: userData.username,
    //         email: userData.email,
    //         id: uid
    //     }).then(response =>{
    //         console.log("data submitted in unknown's message")
    //     }).catch(err => {
    //         console.log(err)
    //     });


    // }
    return (
        <div className={classes.MessagesBox}>
            {/* <button onClick={messageUnknown}>send Message</button> */}
            <ul>
                <li onClick={props.showChatBox}><span style={{backgroundImage:'url('+img+')'}}></span><b>message 1</b><p>this message was sent long ago.</p></li>
                <hr/>
                <li><a href='#'><span style={{backgroundImage:'url('+img+')'}}></span><b>message 2</b><p>this nvcmc message was sent long ago.</p></a></li>
                <hr/>
                <li><a href='#'><span style={{backgroundImage:'url('+img+')'}}></span><b>message 3</b><p>this jjhv,jvm message was sent long ago.</p></a></li>
                <hr/>
                <li><a href='#'><span style={{backgroundImage:'url('+img+')'}}></span><b>message 1</b><p>this message was sent long ago.</p></a></li>
                <hr/>
                <li><a href='#'><span style={{backgroundImage:'url('+img+')'}}></span><b>message 2</b><p>this nvcmc message was sent long ago.</p></a></li>
                <hr/>
                <li><a href='#'><span style={{backgroundImage:'url('+img+')'}}></span><b>message 3</b><p>this jjhv,jvm message was sent long ago.</p></a></li>

            </ul>

        </div>
    );
}

export default MessagesBox;

