import React, {useEffect, useState} from "react";

import {
    Button,
    Card,
    Col,
    Container,
    Figure,
    FloatingLabel,
    Form,
    Modal,
    Row,
    Toast,
    ToastContainer
} from "react-bootstrap";


import Identity from "../../model/Identity";
import {Ajax} from "../../utility/Ajax";

import LoadingIndicator from "../../component/LoadingIndicator/LoadingIndicator";

import GitHubCalendar from 'react-github-calendar';

function Profile(prop) {
    // region profile
    const [displayName, setDisplayName] = useState("");
    const [github, setGithub] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [cancelEdit, setCancelEdit] = useState(false);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        if (prop.content === undefined) { // viewing their own profile
            setLoading(true);
            Ajax.get(`service/authors/${Identity.GetIdentity().id}`)
                .then((resp) => {
                    setDisplayName(resp.data.displayName);
                    setGithub(resp.data.github);
                    setProfileImage(resp.data.profileImage);
                    setCancelEdit(false);
                    setLoading(false);
                })
                .catch(error => {
                    alert("Failed to get user profile.")
                    setTimeout(()=>window.location.reload(), 4000);
                });
        } else { // viewing others profile
            setDisplayName(prop.content.displayName ?? prop.content.display_name);
            setGithub(prop.content.github);
            setProfileImage(prop.content.profileImage ?? "https://dummyimage.com/180x180/aaa/fff");
            setCancelEdit(false);
            setLoading(false);

            Ajax.get(`service/authors/${prop.content.id.slice(-36)}/followers/${Identity.GetIdentity().id}`)
                .then((resp) => {
                    console.log(resp)
                    if (resp.data.length > 0) {
                        setFollowing(true)
                    }
                })
                .catch(error => {
                    alert("Unable to get following status.")
                });
        }
    }, ["", cancelEdit])

    function saveProfile() {
        Ajax.post(
            `service/authors/${Identity.GetIdentity().id}/`,
            {
                displayName: displayName,
                github: github,
                profileImage: profileImage
            }
        ).then(resp => {
            setEdit(false);
        }).catch(error => {
            alert("Failed to update profile.")
            setTimeout(()=>window.location.reload(), 4000);
        })
    }

    function resetProfile() {
        setCancelEdit(true);
        setEdit(false);
    }

    // endregion

    return (
        <Container>
            <LoadingIndicator show={loading} disableScreen />

            {/* region profile */}
            <Card>
                <Card.Body>
                    <Form>
                        {edit ?
                            ""
                            :
                            <>
                                <Row>
                                    <Col style={{textAlign: "center"}}>
                                        <Figure.Image
                                            className="rounded-circle"
                                            width={180}
                                            height={180}
                                            alt="180x180"
                                            src={profileImage}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col style={{textAlign:"center"}}>
                                        {
                                            following ?
                                                <Button>
                                                    Unfollow
                                                </Button>
                                                :
                                                <Button>
                                                    Follow
                                                </Button>
                                        }
                                    </Col>

                                </Row><br/>
                            </>
                        }
                        <fieldset disabled={!edit}>
                            <div>
                                <Row>
                                    <Col>
                                        <FloatingLabel controlId="displayName" label="Display Name">
                                            <Form.Control type="text" value={displayName}
                                                          onChange={(e) => setDisplayName(e.target.value)}/>
                                        </FloatingLabel>
                                    </Col>
                                    <Col>
                                        <FloatingLabel controlId="github" label="Github Address">
                                            <Form.Control type="text" value={github}
                                                          onChange={(e) => setGithub(e.target.value)}/>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col>
                                        <FloatingLabel controlId="profileImageAddress" label="Profile Image Address">
                                            <Form.Control type="text" value={profileImage}
                                                          onChange={(e) => setProfileImage(e.target.value)}/>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                <br/>
                            </div>
                        </fieldset>
                        {prop.content === undefined ?
                            <>
                                {!edit ?
                                    <Row>
                                        <Col className="d-grid gap-2">
                                            <Button variant="primary" onClick={() => setEdit(true)}>
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
                            </>
                            :
                            ""
                        }
                    </Form>
                    <br/>
                    {github !== "" ?
                        <GitHubCalendar username={github.split("/").pop()} style={{margin: "auto"}}/>
                        :
                        ""
                    }
                </Card.Body>
            </Card>
            {/* endregion */}
        </Container>
    )
}

export default Profile;