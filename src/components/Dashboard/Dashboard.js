import React, {useState, useEffect, useContext} from 'react';
import classes from './Dashboard.module.css';
import Header from './Header/Header'
import SearchPage from '../SearchPage/SearchPage';
import FirebaseContext from '../../components/Firebase/context';
import Aux from '../hoc/Auxx';
import Modal from '../UI/Modal/Modal';
import MainBody from '../MainBody/MainBody';


const Dashboard = (props) => {
    const firebase = useContext(FirebaseContext);
    const [UIState, setUIState] = useState({
        showRequestModal: false,
        searchPageShow: false,
        showChatBox: false
    });
    const [chatBoxSpinner, setChatBoxSpinner] = useState(false);
    const [userData, setUserData] = useState(null);
    const [requests, setRequests] = useState(null);
    const [friends, setFriends] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState({
        name: 'person',
        id: ""
    });

   

    useEffect(() => {    // Get all data related to user from database
        const uid = firebase.auth.currentUser.uid;
        firebase.db.ref(`info/${uid}`).once('value',function(snapshot){
            if(snapshot.val()){
            const data = snapshot.val();
            setUserData(data);
            console.log(data);
            }
        }, function(error) {
            if (error) {
              // The write failed...
              console.log(error);
            } else {
              // Data saved successfully!
              console.log(uid, "successfull");

            }
        });
    },[]);

    useEffect(() =>{       //fetch all friends from database
        firebase.db.ref(`friends/${firebase.auth.currentUser.uid}`).once('value',function(snapshot){
            if(snapshot.val()){
                const data = Object.keys(snapshot.val()).map(key =>{
                    const data = snapshot.val()[key];
                    // obj.key = key;
                    return data;
                });
            setFriends(data);
            console.log(data);
            }
        }, function(error) {
            if (error) {
              // The write failed...
              console.log(error);
            } else {
              // Data saved successfully!
              console.log("successfull");

            }
        });
    },[]);

    useEffect(() => {    // Get all requests sent to user from database
        if(userData){
            const uid = firebase.auth.currentUser.uid;
            firebase.db.ref(`sentRequests/${uid}`).once('value',function(snapshot){
            if(snapshot.val()){
                const data = Object.keys(snapshot.val()).map(key =>{
                    const data = snapshot.val()[key];
                    // obj.key = key;
                    return data;
                });
                setRequests(data);
                console.log(data);
            }
        }, function(error) {
            if (error) {
              // The write failed...
              console.log(error);
            } else {
              // Data saved successfully!
              console.log("reqiests are here");

            }
        });
        }
    },[userData]);

    const triggerChatBoxSpinner = () => {
        setChatBoxSpinner(true);
        setTimeout(() => {
            setChatBoxSpinner(false);
        },10);

    }

    const changeSelectedFriend = (event, name, id) =>{
        // event.preventDefault();
          setSelectedFriend({
              name: name,
              id:id
          });
          triggerChatBoxSpinner();
          setUIState({
            ...UIState,
            searchPageShow:false,
            showChatBox: true
        });
    }

    const modalCloseHandler = ()=>{
        setUIState({
            showRequestModal: false
        });
    }
    const modalOpenHandler = ()=>{
        setUIState({
            showRequestModal: true
        });
    }

    const openChatBox = (event)=>{
        event.preventDefault();
        setUIState({
            ...UIState,
            searchPageShow:false,
            showChatBox: true
        });
    }
    const closeChatBox = (event )=>{
        event.preventDefault();
        setUIState({
            ...UIState,
            showChatBox: false
        });
    }

    const acceptRequestHandler = (event, dataOfRequestSender) =>{
        event.preventDefault();
        const uid = firebase.auth.currentUser.uid;
        firebase.db.ref(`friends/${dataOfRequestSender.id}/${uid}`).set({
            name: userData.username,
            email: userData.email,
            id: uid
        }).then(response =>{
            console.log("data submitted in friend's friends")
        }).catch(err => {
            console.log(err)
        });

        firebase.db.ref(`friends/${uid}/${dataOfRequestSender.id}`).set({
            ...dataOfRequestSender
        }).then(response =>{
            console.log("data submitted in my friends")
        }).catch(err => {
            console.log(err)
        });

        firebase.db.ref(`sentRequests/${uid}/${dataOfRequestSender.id}`).remove().then(response =>{
            console.log(dataOfRequestSender.senderName+" is removed")
        }).catch(err=>{
            console.log(err)
        });

    }

    const switchPage = () =>{
          setUIState({
              ...UIState,
              searchPageShow: !UIState.searchPageShow
          });
    }

    return(
        <Aux>
        <Modal show={UIState.showRequestModal} click={modalCloseHandler}>
            <ul>
                {requests? requests.map(request => {
                    return <li key={request.id}><p>{request.name}</p> <button onClick={(event,data) => acceptRequestHandler(event,request)}>Accept</button></li>
                }): null}
            </ul>
        </Modal>
        <div className={classes.Dashboard}>
            <Header userData={userData} switchPage={switchPage} requestModal={modalOpenHandler} requests={requests}/>
            <SearchPage userData={userData} 
                        show={UIState.searchPageShow}
                        openChatBox={openChatBox}
                        selectPerson={changeSelectedFriend} />
                
                        
            <MainBody friends={friends} 
                      show={!UIState.searchPageShow}
                      openChatBox={openChatBox}
                      closeChatBox ={closeChatBox}
                      chatBoxDisplay={UIState.showChatBox}
                      selectPerson={changeSelectedFriend} 
                      selectedPerson={selectedFriend}
                      userData={userData} 
                      chatSpinner={chatBoxSpinner}/>
        </div>
        </Aux>
    );
}

export default Dashboard;