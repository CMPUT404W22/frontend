import React, {useState} from "react";

import {Button, Card, Col, Container, FloatingLabel, Form, Row} from "react-bootstrap";
import {Ajax} from "../utility/Ajax";
import LoadingIndicator from "../component/LoadingIndicator/LoadingIndicator";


function SignUp(prop) {
    // region participant sign up
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [github, setGithub] = useState("");
    const [profileImageLink, serProfileImageLink] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        signUp();
        event.preventDefault();
        event.stopPropagation();
    };

    function signUp() {
        if (password1 !== password2) {
            alert("The 2 passwords your provided does not match");
        }

        let data = {
            "username": username,
            "display_name": displayName,
            "github": github,
            "profileImageLink": profileImageLink,
            "password": password1,
        }

        setLoading(true);

        Ajax.postNoAuth("service/authors/register/", data).then(resp => {
            alert("Success");
            setTimeout(() => window.location.assign("/sign-in"), 2000);
        }).catch(error => {
            alert("Sign up failed, please try again.");
        })
    }

    // end region

    return (
        <Container style={{maxWidth: 1200}}>
            <LoadingIndicator show={loading} disableScreen />
            {/* region role selection */}
            <Card>
                <Card.Body>
                    <Form noValidate validated={true} onSubmit={handleSubmit}>
                        <Row>
                            <Col>
                                <FloatingLabel controlId="username" label="Username">
                                    <Form.Control required
                                                  type="text"
                                                  value={username}
                                                  onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid username
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                        </Row><br/>
                        <Row>
                            <Col>
                                <FloatingLabel controlId="display-name" label="Display Name">
                                    <Form.Control required
                                                  type="text"
                                                  value={displayName}
                                                  onChange={(e) => setDisplayName(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid display name
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel controlId="github" label="Github Address">
                                    <Form.Control required
                                                  type="text"
                                                  value={github}
                                                  onChange={(e) => setGithub(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid github address
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                        </Row><br/>
                        <Row>
                            <Col>
                                <FloatingLabel controlId="profile-image-link" label="Profile Image Link">
                                    <Form.Control required
                                                  type="text"
                                                  value={profileImageLink}
                                                  onChange={(e) => serProfileImageLink(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide your profile image link
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                        </Row><br/>
                        <Row>
                            <Col>
                                <FloatingLabel controlId="password1" label="Password">
                                    <Form.Control required
                                                  type="password"
                                                  value={password1}
                                                  pattern="(?=(.*[0-9]))(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}"
                                                  onChange={(e) => setPassword1(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Password must contain at least 1 uppercase, 1 lowercase, a number and
                                        must be at least 8 characters long.
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                        </Row><br/>
                        <Row>
                            <Col>
                                <FloatingLabel controlId="password2" label="Confirm Password">
                                    <Form.Control required
                                                  type="password"
                                                  value={password2}
                                                  isInvalid={password1 !== password2}
                                                  pattern="(?=(.*[0-9]))(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}"
                                                  onChange={(e) => setPassword2(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Does not match previous password.
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                        </Row><br/>
                        <div className="d-grid gap-2">
                            <Button type={"submit"}>
                                Sign Up
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            {/* endregion */}

        </Container>
    )
}

export default SignUp;