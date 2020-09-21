import React, {useState, useContext, useEffect} from 'react';
import classes from './ImageDisplay.module.css';
import pic from '../../../../assets/user.png';
import Aux from "../../../hoc/Auxx";
import Modal from "../../../UI/Modal/Modal";
import FirebaseContext from '../../../Firebase/context';


const ImageDisplay = props => {
    const firebase = useContext(FirebaseContext);
    const styles = ["fas", "fa-file-upload", classes.IconUpload];
    const [modalOpen, setModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [prevFileData, setData] = useState(null);
    const [imageSrc, setSrc] = useState(pic);

    useEffect(()=> {
        if(props.userData && props.userData.imageUrl){
            setSrc(props.userData.imageUrl);
        }

    },[props.userData]);

    const uploadPictureHandler = () => {
            setModal(modalOpen => !modalOpen);
    }
    const closeModal = () => {
        setModal(modalOpen => !modalOpen);
    }
    const fileInputChange = (event) => {
        if(prevFileData && prevFileData.url){
            URL.revokeObjectURL(prevFileData.url);
        }
        const image = event.target.files[0];
        if(image){
            const Url = URL.createObjectURL(image);
            setModalContent(<img src={Url} width="200px" />);
            setData({
                url: Url,
                file: image
            });
        }
    }
    const fileUploading = (event) => {
        event.preventDefault();
        console.log(prevFileData);
        if(prevFileData && prevFileData.file){
            const storageRef = firebase.storage();

            if(props.userData && props.userData.imageUrl){
                const httpsReference = storageRef.refFromURL(props.userData.imageUrl);
                //Deleting previous file
                httpsReference.delete().then(function() {
                    // File deleted successfully
                }).catch(function(error) {
                    // Uh-oh, an error occurred!
                    console.log(error);
                });
            }

            const pathRef = storageRef.ref(`users/${firebase.auth.currentUser.uid}/`+prevFileData.file.name);

            pathRef.put(prevFileData.file).then(response => {
                console.log("successfully submitted image to backend");
                pathRef.getDownloadURL().then(function(url){

                    //url can be directly used as an src for image;

                    //storing in firebase users section
                    firebase.user(firebase.auth.currentUser.uid).set({
                        email: props.userData.email,
                        username: props.userData.username,
                        imageUrl: url
                    }).then(res => {
                        console.log("data image submitted in realtime db");
                    }).catch(error => {
                        console.log(error);
                    });


                }).catch(err=> {
                    console.log(err);
                });
                if(prevFileData && prevFileData.url){
                    URL.revokeObjectURL(prevFileData.url);
                }

                closeModal();
                
            }).catch( err =>{
                console.log(err);
            });
        }

    }
    return (
        <Aux>
            <div className={classes.ImageDisplay}>
                <div className={classes.Wraper}>
                    <div style={{backgroundImage:"url("+imageSrc+")"}} className={classes.Image}></div>
                    <i className={styles.join(" ")} onClick={uploadPictureHandler}></i>
                </div>
            </div>
            <Modal show={modalOpen} click={closeModal}>
                <h3>Upload Picture</h3>
                <form onSubmit={(event)=> fileUploading(event)}>
                   <input type='file' accept="image/*" onChange={(event)=>fileInputChange(event)} id="imageFileInput"/>
                   <button>Submit</button>
                </form>
                {modalContent}
            </Modal>
        </Aux>
    );
}

export default ImageDisplay;

