import React, {useState, useContext} from 'react';
import classes from './SignUpAndSignIn.module.css';
import FirebaseContext from '../Firebase/context';
 
// import { Redirect } from 'react-router-dom';
const SignUpAndSignIn = (props) =>{
    
    const firebase = useContext(FirebaseContext);

    const [error, setError] = useState(false);

    const checkValidity = (value, rules) => {
        let isValid = true;
        if (!rules) {
            return true;
        }
        
        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        return isValid;
    }
    const styles = [classes.Input]

    const onChangeHandler = (event, input) => {
        const rules = {
            required: true,
            minLength: input==='password'? 6: false,
            isEmail: input==='email'? true: false
        }
        // event.target.className = [classes.Input,classes.Warning].join(' ');
        let valid = checkValidity(event.target.value, rules);
        valid? event.target.className = [classes.Input,classes.Success].join(' ') : event.target.className = [classes.Input,classes.Warning].join(' ');

    }

    const [entry, setEntry] = useState('Sign up');
    const [user, setUser] = useState({
        username: '',
        email: '',
        passwordOne: '',
        passwordTwo: ''
      });


    const changeToLoginHandler = () =>{
          setEntry('Login');
          setError(false);
    }
    const changeToSignUpHandler = () =>{
        setEntry('Sign up');
        setError(false);
    }
    const submitHandler = (event) => {
        event.preventDefault();
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email').value;
        const passwordInput = document.getElementById('password').value;

        // const authData = {
        //     email: emailInput.value,
        //     password: passwordInput.value,
        //     returnSecureToken: true
        // }
        if(entry === 'Login'){
            firebase.doSignInWithEmailAndPassword(emailInput, passwordInput)
            .then(() => {
                setError(false);
            })
            .catch(error => {
                setError(true);
            });
        }
        else{
            firebase.doCreateUserWithEmailAndPassword(emailInput, passwordInput)
            .then((authUser) => {
                setError(false);
                firebase.user(authUser.user.uid).set({username:nameInput.value, email: emailInput}, function(error) {
                    if (error) {
                      // The write failed...
                    } else {
                      // Data saved successfully!
                    }
                });
                firebase.info(authUser.user.uid).set({username:nameInput.value, email: emailInput, friends: null, chats: null}, function(error) {
                    if (error) {
                      // The write failed...
                    } else {
                      // Data saved successfully!
                    }
                });
            })
            .catch(error => {
                setError(true);
            });
        }
     
    }


    return (
        <div className={classes.Box}>
            <h1>CHITCHAT</h1>
            <form>
                <h3>{entry}</h3>
                {error ? <aside> {entry === 'Sign up'?<p>Either email adress you entered is already in use or invalid values are entered. Please try again!</p>:<p>Incorrect email address or password. Please try again!</p>}</aside>: null}
                {entry === 'Sign up'? <p>Already a member? click <strong onClick={changeToLoginHandler}>Login</strong></p>: <p>Not a member? click <strong onClick={changeToSignUpHandler}>Sign up</strong></p>}
                {entry === 'Sign up'? <label><span>Name:</span> <input className={styles.join(' ')} onChange={(event) => onChangeHandler(event, 'name')} type='text' id='name' placeholder='Enter your name' /></label>: null}
                <label><span>Email:</span> <input className={styles.join(' ')} onChange={(event) => onChangeHandler(event, 'email')} id='email' type='email' placeholder='Your email address' /></label>
                <label><span>Password:</span> <input className={styles.join(' ')} onChange={(event) => onChangeHandler(event, 'password')} id='password' type='password' placeholder='password' /></label>
                <button onClick={submitHandler}>SUBMIT</button>
            </form>
        </div>
    )
}
 
export default SignUpAndSignIn;