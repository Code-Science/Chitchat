import React, {useState, useContext, useEffect, useMemo} from 'react';
import classes from './MessagesBox.module.css';
import FirebaseContext from '../../components/Firebase/context';
import img from '../../assets/pinkRose.jpg';
import Aux from '../hoc/Auxx';

const MessagesBox = (props) => {
    const firebase = useContext(FirebaseContext);
    const [chatData, setChatData] = useState(null);
    const [chatInfo, setChatInfo] = useState([]);

    const clickOnMessage = (event, personSharingChatWithName, personSharingChatWithId) => {
        props.selectPerson(event, personSharingChatWithName.username, personSharingChatWithId);
        props.showChatBox();
    }


    useEffect(() =>{       //fetch all user's chats from database
        firebase.db.ref(`chats/${firebase.auth.currentUser.uid}`).once('value',function(snapshot){
            if(snapshot.val()){
                const keysArray = [];
                const data = Object.keys(snapshot.val()).map(key =>{
                    const obj = snapshot.val()[key];
                    keysArray.push(key);
                    return obj;
                });
                setChatData({
                    chats: data,
                    keys: keysArray
                });
            }
        }, function(error) {
            if (error) {
              // The read failed...
              console.log(error);
            }
        });

    },[firebase.auth.currentUser]);


    useEffect(() => {   // fetch chat partners data
         
        if(chatData && chatData.keys.length >= chatInfo.length){
                chatData.keys.forEach((key,i) => {
                    firebase.users().orderByKey().equalTo(key).once('value',function(snapshott){
                        if(snapshott.val()){
                            const data = snapshott.val()[key];
                            data.key = key;
                            let chatMessagePushKeys = Object.keys(chatData.chats[i]);
                        setChatInfo(chatInfo => [...chatInfo, <Aux key={key}><li onClick={(event) => clickOnMessage(event, data, key)}><span style={{backgroundImage:'url('+img+')'}}></span><b>{data.username}</b><p>{chatData.chats[i][chatMessagePushKeys[chatMessagePushKeys.length-1]].message}</p></li>
                                                                   <hr/>
                                                              </Aux>]);

                        }
                    }); 
                });
        }

    },[chatData]);


    return (
        <div className={classes.MessagesBox}>
            <ul>
                {chatInfo}
                {/* <li onClick={props.showChatBox}><span style={{backgroundImage:'url('+img+')'}}></span><b>message 1</b><p>this message was sent long ago.</p></li>
                <hr/>
                <li><a href='#'><span style={{backgroundImage:'url('+img+')'}}></span><b>message 2</b><p>this nvcmc message was sent long ago.</p></a></li>
                <hr/>
                <li><a href='#'><span style={{backgroundImage:'url('+img+')'}}></span><b>message 3</b><p>this jjhv,jvm message was sent long ago.</p></a></li>
                <hr/>
                <li><a href='#'><span style={{backgroundImage:'url('+img+')'}}></span><b>message 1</b><p>this message was sent long ago.</p></a></li>
                <hr/>
                <li><a href='#'><span style={{backgroundImage:'url('+img+')'}}></span><b>message 2</b><p>this nvcmc message was sent long ago.</p></a></li>
                <hr/>
                <li><a href='#'><span style={{backgroundImage:'url('+img+')'}}></span><b>message 3</b><p>this jjhv,jvm message was sent long ago.</p></a></li> */}

            </ul>

        </div>
    );
}

export default MessagesBox;

