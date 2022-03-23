import React, {useState, useEffect} from "react";

import {Button, Card, Col, Container, FloatingLabel, Form, Modal, Row, Toast, ToastContainer} from "react-bootstrap";

import {Helmet} from "react-helmet";

import Identity from "../model/Identity";
import Global from "../utility/Global";
import axios from "axios"
import img_avatar from "./styles/img_avatar.png"
import { Ajax } from "../utility/Ajax";

const identity = Identity.GetIdentity();

function UserProfile(prop) {
    // region shared
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    //endregion

    // region profile
    const [userID, setUserID] = useState(identity.userID);
    const [Username, setUsername] = useState(identity.username);
    const [displayName, setDisplayName] = useState("");
    const [github, setGitHub] = useState("");
    const [edit, setEdit] = useState(false);
    const [changePasswordModal, setChangePasswordModal] = useState(false);

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const auth = {
        auth: {
            username: identity.username,
            password: identity.password
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                await axios.get(`http://127.0.0.1:8000/service/authors/${userID}/`, config, auth)
               .then(function (response){
                   let _data = response.data
                   console.log(_data)
                   setDisplayName(_data.displayName)
                   setGitHub(_data.github)
       
               });
               } catch (error) {
                   console.log(error.message);
                //    setShowToast(true)
               }
        }
        fetchUser();
      }, []);

    const saveProfile = async (e) => {
        e.preventDefault();
        let data = {
            displayName : displayName,
            github: github,
            profileImage: null
        }
        try {
            console.log("user", identity.username)
            console.log("user", identity.password)
            let response = Ajax.post('service/authors/${userID}/', data)
            console.log("re", response)
            // await axios.post(`http://127.0.0.1:8000/service/authors/${userID}/`, data, config, auth)
            // console.log("Success!")
            // setShowToast(true)
            
        } catch (error) {
            console.log(error.message);
            // setShowToast(true)
        }
    }

    const resetProfile = async() => {
        try {
            await axios.get(`http://127.0.0.1:8000/service/authors/${userID}/`, config, auth)
           .then(function (response){
               let _data = response.data
            //    console.log(_data)
               setDisplayName(_data.displayName)
               setGitHub(_data.github)
   
           });
           } catch (error) {
               console.log(error.message);
            //    setShowToast(true)
           }
        setEdit(false)
    }
    // region change password
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");

    function changePassword () {
        // TODO
    }
    // endregion

    return (
        <Container>
            {/* region helmet */}
            <Helmet>
                <title>{Global.TITLE} | Profile</title>
            </Helmet>
            {/* endregion */}

            {/* region profile */}
            <Card>
            <Card.Img src={img_avatar} style={{width:"200px", borderRadius: "50%", alignSelf: 'center' }}/>
                <Card.Body>
                    <Form>
                        <fieldset disabled={!edit}>
                            <div>
                                <Row>
                                    <Col>
                                        <FloatingLabel controlId="username" label="Username">
                                            <Form.Control type="text" value={Username} onChange={(e)=>setUsername(e.target.value)}/>
                                        </FloatingLabel>
                                    </Col>
                                    <Col>
                                        <FloatingLabel controlId="displayName" label="Display Name">
                                            <Form.Control type="text" value={displayName} onChange={(e)=>setDisplayName(e.target.value)}/>
                                        </FloatingLabel>
                                    </Col>
                                </Row><br/>
                                <Row>
                                    <Col>
                                        <FloatingLabel controlId="Github" label="GitHub Link">
                                            <Form.Control type="text" value={github} onChange={(e)=>setGitHub(e.target.value)}/>
                                        </FloatingLabel>
                                    </Col>
                                </Row><br/>
                            </div>
                        </fieldset>
                        {!edit ?
                            <Row>
                                <Col className="d-grid gap-2">
                                    <Button variant="primary" style={{right:0}} onClick={()=>setChangePasswordModal(true)}>
                                        Change Password
                                    </Button>
                                </Col>
                                <Col className="d-grid gap-2">
                                    <Button variant="primary" onClick={()=>setEdit(true)}>
                                        Edit
                                    </Button>
                                </Col>
                            </Row>
                            :
                            <Row>
                                <Col className="d-grid gap-2">
                                    <Button variant="primary" onClick={saveProfile}>
                                        Save
                                    </Button>
                                </Col>
                                <Col className="d-grid gap-2">
                                    <Button variant="primary" onClick={resetProfile}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        }
                    </Form>
                </Card.Body>
            </Card>
            {/* endregion */}

            {/* region change password */}
            <Modal show={changePasswordModal} fullscreen={true} onHide={() => setChangePasswordModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card style={{textAlign:"end"}}>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <FloatingLabel controlId="oldPassword" label="Old Password">
                                        <Form.Control type="password" onChange={(e)=>setOldPassword(e.target.value)}/>
                                    </FloatingLabel>
                                </Col>
                            </Row><br/>
                            <Row>
                                <Col>
                                    <FloatingLabel controlId="newPassword1" label="New Password">
                                        <Form.Control type="password" onChange={(e)=>setNewPassword1(e.target.value)}/>
                                    </FloatingLabel>
                                </Col>
                            </Row><br/>
                            <Row>
                                <Col>
                                    <FloatingLabel controlId="newPassword2" label="Confirm New Password">
                                        <Form.Control type="password" onChange={(e)=>setNewPassword2(e.target.value)}/>
                                    </FloatingLabel>
                                </Col>
                            </Row><br/>
                            <Button onClick={changePassword}>
                                Change Password
                            </Button>
                        </Card.Body>
                    </Card>
                </Modal.Body>
            </Modal>
            {/* endregion */}

            {/* region shared */}
            <ToastContainer className="p-3" position="bottom-center">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={10000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Alert</strong>
                        <small>Just now</small>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            {/* endregion */}
        </Container>
    )
}

export default UserProfile;