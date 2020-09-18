import React, { useEffect, useState, useContext } from 'react';
import classes from './MessageBox.module.css';
import img from '../../../assets/pinkRose.jpg';
import FirebaseContext from '../../Firebase/context';
import Modal from '../../UI/Modal/Modal';
import Aux from "../../hoc/Auxx";
import Spinner from "../../UI/Spinner/Spinner";

const MessageBox = (props) =>{

    const firebase = useContext(FirebaseContext);
    const [chatData, setChatData] = useState(null);
    const [keys, setKeys] = useState(null);
    const [modalState, setModalState] = useState(false);
    const [prevFileData, setData] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    const [showSpinner, setSpinner] = useState(false);





    // retrieve all the chat with selected user
    useEffect(()=>{
       const listener = firebase.db.ref(`chats/${firebase.auth.currentUser.uid}/${props.selectedPerson.id}`).on('value',function(snapshot){
            if(snapshot && snapshot.val()){
                const keysArray = Object.keys(snapshot.val());
                const data = keysArray.map(key =>{
                    return snapshot.val()[key];
                });
                setChatData(data);
                setKeys(keysArray)
                console.log(keysArray);

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
    useEffect(()=>{
        const elem = document.getElementById('messageList');
        elem.scrollTop = elem.scrollHeight;    
    });

    const checkFileType = (type) => {
        if(type.slice(0,6) === "audio/"){
            return "audio";
        }
        else if(type.slice(0,6) === "image/"){
            return "image";
        }
        else if(type.slice(0,6) === "video/"){
            return "video";
        }
        else if(type === "application/pdf"){
            return "pdf";
        }
    }

    const generateHtmlTag = (type, url) => {
        switch(type){
            case "image":
                return (<img src={url} className={classes.chatImage}/>);

            case "video":
                return (<video className={classes.chatImage} controls>
                           <source src={url} type="video/mp4" />
                           <source src={url} type="video/ogg" />
                           Your browser does not support the video tag.
                        </video>);
            case "audio":
                return (<audio controls>
                            <source src={url} type="audio/ogg"/>
                            <source src={url} type="audio/mpeg"/>
                            <source src={url} type="audio/mp3"/>
                            Your browser does not support the audio tag.
                        </audio>);
            case "pdf":
                return (<embed src={url} className={classes.chatImage} />);
            default:
                return (<p>Document not supported!</p>);
        }
    }

    const sendMessage = (event, key) => {
        event.preventDefault();
        const message = document.getElementById('messageInput').value;
        if(message){
        firebase.db.ref(`chats/${key}/${firebase.auth.currentUser.uid}`).push().set({
            senderName: props.userData.username,
            message: message,
            id:firebase.auth.currentUser.uid,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            seen: "no"
        }).then(response =>{    
            console.log("message sent");
        }).catch(err => {
            console.log(err)
        });

        firebase.db.ref(`chats/${firebase.auth.currentUser.uid}/${key}`).push().set({
            senderName: props.userData.username,
            message: message,
            id:firebase.auth.currentUser.uid,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            seen: "yes"
        }).then(response =>{
            // update UI after successful message saving in database
            document.getElementById('messageInput').value='';
            console.log(response);
        }).catch(err => {
            console.log(err)
        });
    }
    }

    const switchModal = (event) => {
        event.preventDefault();
        setModalState(modalState => ! modalState);
    }

    const fileInputChange = (event) => {
        if(prevFileData && prevFileData.url){
            URL.revokeObjectURL(prevFileData.url);
        }
        const file = event.target.files[0];
        if(file){
            const Url = URL.createObjectURL(file);
            const tag = generateHtmlTag(checkFileType(file.type),Url);
            setModalContent(tag);
            setData({
                url: Url,
                file: file
            });
        }
    }

    const fileUploading = (event) => {
        event.preventDefault();
        setSpinner(showSpinner=>!showSpinner);
        if(prevFileData && prevFileData.file){
            const storageRef = firebase.storage();
            const folderName = firebase.auth.currentUser.uid + props.selectedPerson.id;
            const pathRef = storageRef.ref(`chatFiles/${folderName}/`+ prevFileData.file.name);

            pathRef.put(prevFileData.file).then(response => {
                console.log("successfully submitted image to backend");
                pathRef.getDownloadURL().then(function(url){

                    //url can be directly used as an src for image;

                    //storing in firebase chats section
                    firebase.db.ref(`chats/${props.selectedPerson.id}/${firebase.auth.currentUser.uid}`).push().set({
                        senderName: props.userData.username,
                        message: {
                            url: url,
                            type: checkFileType(prevFileData.file.type)
                        },
                        id:firebase.auth.currentUser.uid,
                        createdAt: firebase.database.ServerValue.TIMESTAMP,
                        seen: "no"
                    }).then(response =>{    
                        console.log("message sent");
                    }).catch(err => {
                        console.log(err)
                    });
            
                    firebase.db.ref(`chats/${firebase.auth.currentUser.uid}/${props.selectedPerson.id}`).push().set({
                        senderName: props.userData.username,
                        message: {
                            url: url,
                            type: checkFileType(prevFileData.file.type)
                        },
                        id:firebase.auth.currentUser.uid,
                        createdAt: firebase.database.ServerValue.TIMESTAMP,
                        seen: "yes"
                    }).then(response =>{
                        // update UI after successful message saving in database
                        console.log(response);
                    }).catch(err => {
                        console.log(err)
                    });
            



                }).catch(err=> {
                    console.log(err);
                });
                if(prevFileData && prevFileData.url){
                    URL.revokeObjectURL(prevFileData.url);
                    setData(null);
                }
                setSpinner(showSpinner=>!showSpinner);
                setModalState(modalState => ! modalState);
                
            }).catch( err =>{
                console.log(err);
            });
        }

    }

    let modalData = (<div><h3>Share Image or video</h3>
                       <form onSubmit={(event)=> fileUploading(event)}>
                              <input type='file' accept="image/*,video/*,.pdf,.doc,audio/*" onChange={(event)=>fileInputChange(event)} id="FileInput"/>
                              <button>Submit</button>
                       </form>
                       {modalContent}
                       </div>);
    if(showSpinner){
        modalData = <Spinner top="8vh"/>
    }


    let data = null;
    if(chatData){
        data = chatData.map((message, i) => {
            const time = new Date(message.createdAt);
            if(message.id == firebase.auth.currentUser.uid){
                if(typeof message.message === "string"){
                   return  <li key={i+message.name} className={classes.ListMe}><aside className={classes.Me}><span></span>{message.message}</aside><span className={classes.Time2}><em>{(time.getHours()).toFixed(2)}</em><em>{time.toDateString().slice(4,10)}</em></span></li>
                }else{
                    return  <li key={i+message.name} className={classes.ListMe}><aside className={classes.Me}><span></span>{generateHtmlTag(message.message.type,message.message.url)}</aside><span className={classes.Time2}><em>{(time.getHours()).toFixed(2)}</em><em>{time.toDateString().slice(4,10)}</em></span></li>
                }
            }else{
                if(typeof message.message === "string"){
                    return  <li key={i+message.name} className={classes.ListFriend}><span className={classes.Time}><em>{(time.getHours()).toFixed(2)}</em><em>{time.toDateString().slice(4,10)}</em></span><aside className={classes.Friend}><span></span>{message.message}</aside></li>
                }else{
                    return  <li key={i+message.name} className={classes.ListFriend}><span className={classes.Time}><em>{(time.getHours()).toFixed(2)}</em><em>{time.toDateString().slice(4,10)}</em></span><aside className={classes.Friend}><span></span>{generateHtmlTag(message.message.type,message.message.url)}</aside></li>
                }
            }
        });
        
        // changing last message status to seen
        if(!(chatData[chatData.length-1].id === firebase.auth.currentUser.uid)){
            if(keys){
            const lastKey = keys[keys.length-1];
            console.log(lastKey);
            firebase.db.ref(`chats/${firebase.auth.currentUser.uid}/${props.selectedPerson.id}/${lastKey}/seen`).set("yes");
            }
        }
        
    }

    return(
        <Aux>
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
                <button onClick={(event)=>sendMessage(event, props.selectedPerson.id)}>Enter</button>
                <button onClick={event => switchModal(event)}><i class="fas fa-photo-video"></i></button>
                </form>

            </div>
            <Modal show={modalState} click={switchModal}>

                {modalData}

            </Modal>
        </Aux>
    );
}

export default MessageBox;