import React, {useState, useContext, useEffect} from 'react';
import classes from './MessagesBox.module.css';
import FirebaseContext from '../../components/Firebase/context';
import img from '../../assets/pinkRose.jpg';
import Aux from '../hoc/Auxx';

const MessagesBox = (props) => {
    const firebase = useContext(FirebaseContext);
    const [chatData, setChatData] = useState(null);
    const [chatInfo, setChatInfo] = useState([]);


    useEffect(() =>{       //fetch all user's chats from database
    const listener = firebase.db.ref(`chats/${firebase.auth.currentUser.uid}`).on('value',function(snapshot){
            if(snapshot && snapshot.val()){
                const keysArray = Object.keys(snapshot.val());
                 //sorting keys based on the latest message activity using firebase timestamp
                 keysArray.sort((a, b) => {
                    const chatMessagePushKeysA = Object.keys(snapshot.val()[a]);
                    const chatMessagePushKeysB = Object.keys(snapshot.val()[b]);
                    const prev = snapshot.val()[a][chatMessagePushKeysA[chatMessagePushKeysA.length-1]].createdAt;
                    const current = snapshot.val()[b][chatMessagePushKeysB[chatMessagePushKeysB.length-1]].createdAt;
                    return current - prev;
                });
                const data = keysArray.map(key =>{
                    const obj = snapshot.val()[key];
                    return obj;
                });
                console.log(data);
               

                setChatData({
                    chats: data,
                    keys: keysArray
                });
            }
        });
        return () => listener();

    },[firebase.auth.currentUser]);



    const clickOnMessage = (event, personSharingChatWithName, personSharingChatWithId) => {

        props.selectPerson(event, personSharingChatWithName.username, personSharingChatWithId);
        props.showChatBox();
    }

    useEffect(() => {   // fetch chat partners data

         
        if(chatData && chatData.keys.length >= chatInfo.length){
                chatData.keys.forEach((key,i) => {
                    firebase.users().orderByKey().equalTo(key).once('value',function(snapshott){
                        if(snapshott.val()){
                            const data = snapshott.val()[key];
                            data.key = key;
                            const chatMessagePushKeys = Object.keys(chatData.chats[i]);
                            const seen = chatData.chats[i][chatMessagePushKeys[chatMessagePushKeys.length-1]].seen ;
                            const lastMessage = chatData.chats[i][chatMessagePushKeys[chatMessagePushKeys.length-1]].message;
                            console.log((new Date(chatData.chats[i][chatMessagePushKeys[chatMessagePushKeys.length-1]].createdAt)));
                        setChatInfo(chatInfo => {
                            const imageUrl = data.imageUrl? data.imageUrl : img;
                            if(chatInfo[i]){
                            console.log(chatInfo[i].key);
                              let updatedData = [...chatInfo];
                              updatedData[i] = <Aux key={key}><li onClick={(event) => clickOnMessage(event, data, key)}><span style={{backgroundImage:'url('+imageUrl+')'}}></span><b>{data.username}</b><p className={seen === "no"? classes.Unseen : "non"}>{typeof lastMessage === "string"? lastMessage: lastMessage.type}</p></li>
                                              <hr/>
                                           </Aux>;
                             return updatedData;
                            }else{
                             return [...chatInfo, <Aux key={key}><li onClick={(event) => clickOnMessage(event, data, key)}><span style={{backgroundImage:'url('+imageUrl+')'}}></span><b>{data.username}</b><p className={seen === "no"? classes.Unseen:"non"}>{typeof lastMessage === "string"? lastMessage: lastMessage.type}</p></li>
                                                                   <hr/>
                                                              </Aux>];
                            }
                        });

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

