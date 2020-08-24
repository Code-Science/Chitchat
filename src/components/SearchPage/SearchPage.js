import React, {useState, useContext} from 'react';
import classes from './SearchPage.module.css';
import FirebaseContext from '../../components/Firebase/context';

const SearchPage = props => {
    const [usersArray, setUsers] = useState(null)
    const firebase = useContext(FirebaseContext);
    const searchHandler = (event) =>{
        event.preventDefault();
        const value = document.getElementById('searchBar').value;
        let isEmail = false;
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isEmail = pattern.test(value);
        let orderBy = isEmail? 'email': 'username';
        firebase.users().orderByChild(orderBy).equalTo(value).once('value',function(snapshot){
            const data = Object.keys(snapshot.val()).map(key =>{
                const obj = snapshot.val()[key];
                    obj.key = key;
                    return obj;
                // return snapshot.val()[key];
            });
            setUsers(data);
            console.log(data);
        });
    } 

    const addFriendHandler = (event, key) =>{
        event.preventDefault();
        firebase.db.ref(`sentRequests/${key}/${firebase.auth.currentUser.uid}`).set({name: props.userData.username, email: props.userData.email, id:firebase.auth.currentUser.uid}, function(error) {
            if (error) {
              console.log(error)
            } else {
              console.log('request sent successfully')
            }
        });
    }
    // const sendMessage = (event, key) => {
    //     event.preventDefault();
    //     firebase.db.ref(`unknownChats/${key}/${firebase.auth.currentUser.uid}`).push().set({
    //         senderName: props.userData.username,
    //         message: 'dreams can come true',
    //         id:firebase.auth.currentUser.uid
    //     }).then(response =>{
    //         console.log("data submiatted in unknown's message")
    //     }).catch(err => {
    //         console.log(err)
    //     });

    //     firebase.db.ref(`unknownChats/${firebase.auth.currentUser.uid}/${key}`).push().set({
    //         senderName: props.userData.username,
    //         message: 'dreams can come true',
    //         id:firebase.auth.currentUser.uid
    //     }).then(response =>{
    //         console.log("data submiatted in unknown's message")
    //     }).catch(err => {
    //         console.log(err)
    //     });


    // }

    let data = <li>Enter name or email address in the search box to find friends</li>
    if(usersArray){
        data = usersArray.map((requestSentToUserData, i )=> {
            return <li key={i+requestSentToUserData.username}>{requestSentToUserData.username}
                  
                  <button onClick={(event, key) => addFriendHandler(event, requestSentToUserData.key)}>Add Friend</button>
                  <button onClick={(event, name, id)=> props.selectPerson(event, requestSentToUserData.username, requestSentToUserData.key)}>Send Message</button>
                </li>
        });
    }
    return (
       <div className={classes.SearchPage} style={{display: props.show? "block":"none"}}>
           <p>You can search your friends below </p>
           <form>
              <input type='text' placeholder='Search by name or email' id='searchBar' />
              <button onClick={searchHandler}>Search</button>
           </form>
           <ul>
              {data}
           </ul>
       </div>
    );
}

export default SearchPage;