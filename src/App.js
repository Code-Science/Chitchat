import React, {useState, useEffect, useContext} from 'react';
import './App.css';
import SignUpAndSignIn from './components/SignUpAndSignIn/SignUpAndSignIn';
import { Route, Switch, Redirect} from 'react-router-dom';
import FirebaseContext from './components/Firebase/context';
import Spinner from './components/UI/Spinner/Spinner';
import BodyBackground from './components/BodyBackground/BodyBackground'

function App() {
  const [authUserr, setAuth] = useState(null);
  const firebase = useContext(FirebaseContext);
  const [content, setContent] = useState(<Spinner />)
  useEffect(()=>{
    const listener = firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? setAuth(authUser)
        : setAuth(null);
    });
    return function cleanUp(){
       listener();
    };
  }, []);
  useEffect(() => {
    setContent(<Spinner />)
    setTimeout(()=>{
        setContent(<Switch>
                       {authUserr || firebase.auth.currentUser? <Route path="/" component={BodyBackground} /> : <Route path="/" exact component={SignUpAndSignIn} />}
                       <Redirect to='/'/>
                    </Switch>)
    }, 1000)
  },[authUserr]);
  
  return (
    <div className="App">
       {content}
    </div>
  );
}

export default App;
