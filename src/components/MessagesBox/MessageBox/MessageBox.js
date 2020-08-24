import React, { useEffect, useState, useContext } from 'react';
import classes from './MessageBox.module.css';
import img from '../../../assets/pinkRose.jpg';
import FirebaseContext from '../../Firebase/context';


const MessageBox = (props) =>{

    const firebase = useContext(FirebaseContext);
    const [chatData, setChatData] = useState(null);
    
    // retrieve all the chat with selected user
    useEffect(()=>{
       
       const listener = firebase.db.ref(`chats/${firebase.auth.currentUser.uid}/${props.selectedPerson.id}`).on('value',function(snapshot){
            if(snapshot && snapshot.val()){
                const data = Object.keys(snapshot.val()).map(key =>{
                    return snapshot.val()[key];
                });
                setChatData(data);
                console.log(data);
            }
        }, function(error) {
            if (error) {
              // The write failed...
              console.log(error);
            }
        });
        console.log(props.selectedPerson.name);
        return () => listener();

    },[props.selectedPerson])

    const sendMessage = (event, key) => {
        event.preventDefault();
        const message = document.getElementById('messageInput').value;
        firebase.db.ref(`chats/${key}/${firebase.auth.currentUser.uid}`).push().set({
            senderName: props.userData.username,
            message: message,
            id:firebase.auth.currentUser.uid
        }).then(response =>{
            console.log("message sent")
        }).catch(err => {
            console.log(err)
        });

        firebase.db.ref(`chats/${firebase.auth.currentUser.uid}/${key}`).push().set({
            senderName: props.userData.username,
            message: message,
            id:firebase.auth.currentUser.uid
        }).then(response =>{
            document.getElementById('messageInput').value=''
            console.log("message sent")
        }).catch(err => {
            console.log(err)
        });


    }
    let data = null;
    if(chatData){
        data = chatData.map((message, i) => {
            if(message.id == firebase.auth.currentUser.uid){
              return  <li key={i+message.name} className={classes.ListMe}><aside className={classes.Me}><span></span>{message.message}</aside><span className={classes.Time2}>:time </span></li>
            }else{
              return  <li key={i+message.name} className={classes.ListFriend}><span className={classes.Time}>time: </span><aside className={classes.Friend}><span></span>{message.message}</aside></li>
            }
        });    
    }

    return(
        <div className={classes.MessageBox} >
            <div className={classes.ChatHead}>
            <span style={{backgroundImage:'url('+img+')'}}></span><b>{props.selectedPerson? props.selectedPerson.name:"Person"}</b>
            <button onClick={props.close}>Exit</button>
            </div>
            <ul id='messageList'>
                {data}
                {/* <li className={classes.ListFriend}><span className={classes.Time}>time: </span><aside className={classes.Friend}><span></span>gvmnvbjdjytfjycrjytrytrytrxchrejdytjytrxcjtyrjycrjyrjyc rjytrjyrjyrjry</aside></li>
                <li className={classes.ListMe}><aside className={classes.Me}><span></span>gvmnvb jhjhgckj djbckj jhjbcj kjkbkcb bckjb kjkjwb dkjjcbnkwj .knckjw kjjnkj kkjjnvk ,jkbvk kjjbkj ,kj </aside><span className={classes.Time2}>:time </span></li> */}
            </ul>
            <form>
               <input type='text' placeholder='Enter message  here ... ' id="messageInput"/>
               <button onClick={(event, key)=>sendMessage(event, props.selectedPerson.id)}>Enter</button>
            </form>

        </div>
    );
}

export default MessageBox;