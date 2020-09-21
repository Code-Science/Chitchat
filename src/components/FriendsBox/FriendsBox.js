import React, {useState, useContext, useEffect} from 'react';
import classes from './FriendsBox.module.css';
import FirebaseContext from '../../components/Firebase/context';
import img from '../../assets/user.png';


const FriendsBox = (props) => {
    let data = <p>You dont have any friends yet, click search to find some</p>;
    const firebase = useContext(FirebaseContext);
    const [friendImageUrls, setImageUrls] = useState(null);

    //fetching updated friends data

    useEffect(()=>{
        if(props.friends){
            const urls = [];
        props.friends.forEach((friend,i) => {
            firebase.user(friend.id).orderByChild("imageUrl").once('value',function(snapshot){
                if(snapshot && snapshot.val() && snapshot.val().imageUrl){
                   urls.push(snapshot.val().imageUrl);  
                }else{
                    urls.push(undefined);
                }
                if(i === (props.friends.length-1)){
                    setImageUrls(urls);
                }
            });

        });
        }

        const interval = setInterval(()=>{
            if(props.friends){
                const urls = [];
            props.friends.forEach((friend,i) => {
                firebase.user(friend.id).orderByChild("imageUrl").once('value',function(snapshot){
                    if(snapshot && snapshot.val() && snapshot.val().imageUrl){
                       console.log(snapshot.val().imageUrl) 
                       urls.push(snapshot.val().imageUrl);  
                    }else{
                        urls.push(undefined);
                    }
                    if(i === (props.friends.length-1)){
                        setImageUrls(urls);
                    }
                });
    
            });
            }
            
        },60000);

        return () => clearInterval(interval);


    },[props.friends]);



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
            const imageSrc = friendImageUrls? friendImageUrls[i]? friendImageUrls[i] : img : img;
            return <li key={i+friend}><img src={imageSrc} />{friend.name}
                  <aside className={classes.Btns}>
                    <button onClick={(event)=> props.selectPerson(event, friend.name, friend.id, imageSrc)}><i className="fas fa-envelope"></i></button>
                    <button onClick={(event) => removeFriendHandler(event, friend.id)}><i className="fas fa-users-slash"></i></button>
                  </aside>
                </li>
        });
    }
    
    return (
        <div className={classes.FriendsBox} style={{visibility:props.show? "visible":"hidden", transform: props.show? 'translateX(0px)':'translateX(1000px)'}}>
             <ul>
                {data}
             </ul>
        </div>
    )
}

export default FriendsBox;