import React, {useState, useContext} from 'react';
import classes from './SearchPage.module.css';
import FirebaseContext from '../../components/Firebase/context';
import img from '../../assets/user.png';


const SearchPage = props => {
    const [usersArray, setUsers] = useState(null)
    const firebase = useContext(FirebaseContext);
    const searchHandler = (event) => {
        event.preventDefault();
        let value = document.getElementById('searchBar').value;
        if(value){ 
        value = value.toLowerCase();
        let isEmail = false;
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isEmail = pattern.test(value);
        let orderBy = isEmail? 'email': 'username';
        firebase.users().orderByChild(orderBy).equalTo(value).once('value',function(snapshot){
            if(snapshot && snapshot.val()){
                const data = [];
                Object.keys(snapshot.val()).forEach(key => {
                    if(key != firebase.auth.currentUser.uid){

                        if(props.friendsKeys && !props.friendsKeys.includes(key)){
                            const obj = snapshot.val()[key];
                                obj.key = key;
                                data.push(obj);
                        }else if(!props.friendsKeys){
                            const obj = snapshot.val()[key];
                                obj.key = key;
                                data.push(obj);
                        }
                    }
                });
                setUsers(data);
                console.log(data);
            }else{
                setUsers("not found");
            }
        });
    }
    } 

    const addFriendHandler = (event, key, elementId) =>{
        event.preventDefault();
        firebase.db.ref(`sentRequests/${key}/${firebase.auth.currentUser.uid}`).set({ name: props.userData.username, 
                                                                                      email: props.userData.email, 
                                                                                      id:firebase.auth.currentUser.uid,
                                                                                      imageUrl:props.userData.imageUrl||null})
        .then(()=>{
              const ele = document.getElementById(elementId);
              ele.innerHTML = "Request sent!";
        }).catch(error=>{
            const ele = document.getElementById(elementId);
            ele.innerHTML = "Request already sent!";
        });
    }
    let data = <li className={classes.Initial}>Enter name or email address in the search box to find friends</li>
    if(usersArray && usersArray != "not found" && usersArray.length != 0){
        data = usersArray.map((requestSentToUserData, i )=> {
            const imageUrl = requestSentToUserData.imageUrl || img;
            return <li key={i+requestSentToUserData.username} id={i+requestSentToUserData.username}><div style={{backgroundImage: "url("+imageUrl+")"}} className={classes.DivImage}></div> {requestSentToUserData.username}
                  
                  <button onClick={(event) => addFriendHandler(event, requestSentToUserData.key, i+requestSentToUserData.username)}>Add Friend</button>
                  <button onClick={(event)=> props.selectPerson(event, requestSentToUserData.username, requestSentToUserData.key, imageUrl)}>Send Message</button>
                </li>
        });
    }else if(usersArray && (usersArray === "not found" || usersArray.length === 0)){
        data = <li>Result not found</li>
    }
    return (
       <div className={classes.SearchPage} style={{display: props.show? "block":"none"}}>
           <form>
              <input type='text' placeholder='Search by name or email' id='searchBar' />
              <button onClick={searchHandler} className={classes.SearchButton}>Search</button>
           </form>
           <ul>
              {data}
           </ul>
       </div>
    );
}

export default SearchPage;