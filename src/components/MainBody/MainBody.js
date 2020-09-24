import React from 'react';
import classes from './MainBody.module.css';
import FriendsBox from '../FriendsBox/FriendsBox';
import MessagesBox from '../MessagesBox/MessagesBox';
import ChatBox from '../MessagesBox/MessageBox/MessageBox';
import Spinner from '../UI/Spinner/Spinner';
 
const MainBody = (props) => {


    return (
        <div className={classes.MainBody} style={{visibility: props.show? "visible": "hidden"}}>
            {!props.chatBoxDisplay? 
            <MessagesBox showChatBox={props.openChatBox} selectPerson={props.selectPerson} />:
            props.chatSpinner? <Spinner/>: <ChatBox close={props.closeChatBox} selectedPerson={props.selectedPerson} userData={props.userData} /> }

            <FriendsBox friends={props.friends} showChatBox={props.openChatBox} selectPerson={props.selectPerson} show={props.friendsBoxDisplay} changeShow={props.changeFriendsBoxDisplay}/>
            
        </div>
    );
}

export default MainBody;