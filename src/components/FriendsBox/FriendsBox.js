import React, {useState, useContext} from 'react';
import classes from './FriendsBox.module.css';
import FirebaseContext from '../../components/Firebase/context';
import img from '../../assets/albi.jpg';


const FriendsBox = (props) => {
    let data = <p>You dont have any friends yet, click search to find some</p>;
    const firebase = useContext(FirebaseContext);



    const removeFriendHandler = (event, friendId) =>{
           event.preventDefault();
           firebase.db.ref(`friends/${firebase.auth.currentUser.uid}/${friendId}`).remove().then(response =>{
                console.log(friendId+" is removed");
                firebase.db.ref(`friends/${friendId}/${firebase.auth.currentUser.uid}`).remove().then(response =>{
                    console.log(friendId+" is removed");
                    
                }).catch(err=>{
                    console.log(err)
                });
            }).catch(err=>{
                console.log(err)
            });

    }
    if(props.friends){
        data = props.friends.map((friend, i )=> {
            return <li key={i+friend}><img src={img} />{friend.name}
                  <aside className={classes.Btns}>
                    <button onClick={(event, name, id)=> props.selectPerson(event, friend.name, friend.id)}><i className="fas fa-envelope-square"></i></button>
                    <button onClick={(event, friendId) => removeFriendHandler(event, friend.id)}><i className="fas fa-users-slash"></i></button>
                  </aside>
                </li>
        });
    }
    
    return (
        <div className={classes.FriendsBox}>
             <ul>
                {data}
             </ul>
        </div>
    )
}

export default FriendsBox;