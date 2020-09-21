import React, {useState, useEffect, useContext} from 'react';
import classes from './Dashboard.module.css';
import Header from './Header/Header'
import SearchPage from '../SearchPage/SearchPage';
import FirebaseContext from '../../components/Firebase/context';
import Aux from '../hoc/Auxx';
import Modal from '../UI/Modal/Modal';
import MainBody from '../MainBody/MainBody';
import img from "../../assets/user.png";


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
    const [requestSeen, setRequestSeen] = useState(true);
    const [friends, setFriends] = useState(null);
    const [friendsKeys, setFriendsKeys] = useState(null);
    const [friendsBoxDisplay, setFriendsBoxDisplay] = useState(true);
    const [selectedFriend, setSelectedFriend] = useState({
        name: 'person',
        id: "",
        imageUrl: null
    });

   

    useEffect(() => {    // Get all data related to user from database
        const uid = firebase.auth.currentUser.uid;
        const listener = firebase.db.ref(`users/${uid}`).on('value',function(snapshot){
            if(snapshot && snapshot.val()){
            const data = snapshot.val();
            setUserData(data);
            }
        }, function(error) {
            if (error) {
              // The write failed...
              console.log(error);
            } else {
              // Data saved successfully!

            }
        });

        return () => listener();
    },[]);

    useEffect(() =>{       //fetch all friends from database
        firebase.db.ref(`friends/${firebase.auth.currentUser.uid}`).on('value',function(snapshot){
            if(snapshot && snapshot.val()){
                const keysArray = [];
                const data = Object.keys(snapshot.val()).map(key =>{
                    const data = snapshot.val()[key];
                    keysArray.push(key);
                    return data;
                });
            setFriends(data);
            setFriendsKeys(keysArray);
            }
        }, function(error) {
            if (error) {
              // The write failed...
              console.log(error);
            } else {
              // Data saved successfully!

            }
        });
    },[]);

    useEffect(() => {    // Get all requests sent to user from database
        if(userData){
            const uid = firebase.auth.currentUser.uid;
            const listener = firebase.db.ref(`sentRequests/${uid}`).on('value',function(snapshot){
                if(snapshot && snapshot.val()){
                    const data = Object.keys(snapshot.val()).map(key =>{
                        const data = snapshot.val()[key];
                        // obj.key = key;
                        return data;
                    });
                    setRequests(data);
                    setRequestSeen(false);
                }
            });
            return () => listener();
        }
    },[userData]);

    const triggerChatBoxSpinner = () => {
        setChatBoxSpinner(true);
        setTimeout(() => {
            setChatBoxSpinner(false);
        },10);

    }

    const changeSelectedFriend = (event, name, id, image) =>{
        event.preventDefault();
          setSelectedFriend({
              name: name,
              id:id,
              imageUrl:image
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
            ...UIState,
            showRequestModal: false
        });
    }
    const modalOpenHandler = ()=>{
        setUIState({
            ...UIState,
            showRequestModal: true
        });
        setRequestSeen(true);
    }

    const openChatBox = ()=>{
        // event.preventDefault();
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

    const friendsBoxDisplayHandler = () => {
        setFriendsBoxDisplay(friendsBoxDisplay=>! friendsBoxDisplay);
    }

    const acceptRequestHandler = (event, dataOfRequestSender) =>{
        event.preventDefault();
        const uid = firebase.auth.currentUser.uid;
        firebase.db.ref(`friends/${dataOfRequestSender.id}/${uid}`).set({
            name: userData.username,
            email: userData.email,
            id: uid,
            imageUrl:userData.imageUrl || null
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
            if(requests.length === 1 ){
                setRequests(null);
            }
        }).catch(err=>{
            console.log(err)
        });
        modalCloseHandler();

    }
    const rejectRequestHandler = (event, dataOfRequestSender) => {
        event.preventDefault();
        const uid = firebase.auth.currentUser.uid;
        firebase.db.ref(`sentRequests/${uid}/${dataOfRequestSender.id}`).remove().then(response =>{
            console.log(dataOfRequestSender.senderName+" is removed")
            if(requests.length === 1 ){
                setRequests(null);
            }
        }).catch(err => {
            console.log(err)
        });
        modalCloseHandler();
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
                    const imageUrl = request.imageUrl || img;
                    return <li key={request.id} className={classes.listItemRequests}><div style={{backgroundImage: "url("+imageUrl+")"}} className={classes.DivImage}></div> <p>{request.name}</p> <button onClick={(event) => acceptRequestHandler(event,request)}>Accept</button><button onClick={(event) => rejectRequestHandler(event,request)}>Reject</button></li>
                }): <li>NO REQUESTS IN QUEUE</li>}
            </ul>
        </Modal>
        <div className={classes.Dashboard}>
            <Header userData={userData} 
                    switchPage={switchPage} 
                    requestModal={modalOpenHandler} 
                    searchPageShow={UIState.searchPageShow}
                    requestSeen={requestSeen}
                    changeFriendsBoxDisplay={friendsBoxDisplayHandler}/>

    
            <SearchPage userData={userData} 
                        show={UIState.searchPageShow}
                        openChatBox={openChatBox}
                        selectPerson={changeSelectedFriend} 
                        friendsKeys = {friendsKeys}/>
                
                        
            <MainBody friends={friends} 
                      show={!UIState.searchPageShow}
                      openChatBox={openChatBox}
                      closeChatBox ={closeChatBox}
                      chatBoxDisplay={UIState.showChatBox}
                      selectPerson={changeSelectedFriend} 
                      selectedPerson={selectedFriend}
                      userData={userData} 
                      chatSpinner={chatBoxSpinner}
                      friendsBoxDisplay={friendsBoxDisplay} />
        </div>
        </Aux>
    );
}

export default Dashboard;