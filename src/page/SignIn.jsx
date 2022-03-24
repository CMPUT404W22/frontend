import React, {useState} from "react";

import {Button, Card, Container, Form, InputGroup, Modal, Toast, ToastContainer} from "react-bootstrap";

import {Link} from "react-router-dom";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faKey, faUser} from '@fortawesome/free-solid-svg-icons'

import {AuthProvider} from "../auth/AuthProvider";


/**
 * Sign in page
 * @param prop
 * @returns {JSX.Element}
 * @constructor
 */
function SignIn(prop) {
    // region sign in page
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [failed, setFailed] = useState(false);

    /**
     * Sign in
     */
    function signIn() {
        AuthProvider.signIn(username, password);
    }

    // endregion

    return (
        <Container style={{maxWidth: 800}}>
            {/* region toast */}
            <ToastContainer position={"bottom-center"} style={{paddingBottom: 20}}>
                <Toast onClose={() => setFailed(false)} show={failed} delay={10000} autohide>
                    <Toast.Body>
                        <i>Sign in failed. Please check your username and password.</i>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
            {/* endregion */}

            {/* region sign in page */}
            <Card>
                <Card.Body>
                    <Card.Title>Sign in to your account</Card.Title>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faUser}/>
                                </InputGroup.Text>
                                <Form.Control type="username" placeholder="Username"
                                              onChange={(e) => setUsername(e.target.value)} required/>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faKey}/>
                                </InputGroup.Text>
                                <Form.Control type="password" placeholder="Password"
                                              onChange={(e) => setPassword(e.target.value)} required/>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Text className="text-muted">
                                <Link to="/sign-up">Don't have an account? Sign up here -></Link>
                            </Form.Text>
                        </Form.Group>
                        <Button variant="primary" onClick={() => signIn()}>
                            Sign in
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            {/* endregion */}
        </Container>
    );
}

export default SignIn;