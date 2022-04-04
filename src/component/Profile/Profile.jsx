import React, {useEffect, useState} from "react";

import {
    Button,
    Card,
    Col,
    Container,
    Figure,
    FloatingLabel,
    Form,
    Row
} from "react-bootstrap";


import Identity from "../../model/Identity";
import {Ajax} from "../../utility/Ajax";

import LoadingIndicator from "../../component/LoadingIndicator/LoadingIndicator";

import GitHubCalendar from 'react-github-calendar';

function Profile(prop) {
    // region profile
    const [displayName, setDisplayName] = useState("");
    const [github, setGithub] = useState("");
    const [image, setImage] = useState("")
    const [host, setHost] = useState("")
    const [otherId, setOtherID] = useState("")
    const [profileImage, setProfileImage] = useState("");
    const [cancelEdit, setCancelEdit] = useState(false);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [following, setFollowing] = useState(false);
    const [followed, setFollowed] = useState(false)
    const [buttonText, setButtonText] = useState("Follow");
    const [followers, setFollowers] = useState([]);
    const [actor_id] = useState("https://cmput404-w22-project-backend.herokuapp.com/authors/"+Identity.GetIdentity().id)

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
            Ajax.get(`service/authors/${Identity.GetIdentity().id}/followers?origin=local`)
                .then((resp) => {
                    console.log("follower", resp.data.items)
                    setFollowers(resp.data.items)
                })
        } else { // viewing others profile
            // console.log("prop", prop.content)
            setOtherID(prop.content.id)
            setDisplayName(prop.content.displayName ?? prop.content.display_name);
            setGithub(prop.content.github);
            setImage(prop.content.profileImage);
            setProfileImage(prop.content.profileImage ?? "https://dummyimage.com/180x180/aaa/fff");
            setHost(prop.content.host)
            setCancelEdit(false);
            setLoading(false);
            Ajax.get(`service/authors/${prop.content.id.slice(-36)}/followers?origin=${prop.content.id.getNodeOrigin()}
            `)
                .then((resp) => {
                    console.log("follower", resp.data.items)
                    setFollowers(resp.data.items)
                })
                .catch(error => {
                    alert("Unable to get followers.")
                });
            Ajax.get(`service/authors/${prop.content.id.slice(-36)}/followers/${Identity.GetIdentity().id}?origin=${prop.content.id.getNodeOrigin()}&actor_id=${actor_id}&object_id=${prop.content.id}`)
                .then((resp) => {
                    console.log("following", resp.data)
                    setFollowing(resp.data)
                })
                .catch(error => {
                    alert("Unable to get following status.")
                });
            Ajax.get(`service/authors/${Identity.GetIdentity().id}/followers/${prop.content.id.slice(-36)}?origin=local&object_id=${actor_id}&actor_id=${prop.content.id}`)
                .then((resp) => {
                    console.log("followed", resp.data)
                    setFollowed(resp.data)
                })
                .catch(error => {
                    alert("Unable to get friend status.")
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

    function sendFollowRequest() {
        // sends a follow request
        let user;
        let summary;

        setButtonText("Requested")
        // gets the user author object
        Ajax.get(`service/authors/${Identity.GetIdentity().id}/`)
            .then(resp => {
                user = resp.data;
                let to_follow = {
                    type: "author",
                    id: otherId,
                    url: otherId,
                    host: host,
                    displayName: displayName,
                    github: github,
                    profileImage: image
                }
                summary = user.displayName + " wants to follow " + to_follow.displayName;
                Ajax.post(
                    // sends a follow notification to the author to follow's inbox
                    `service/authors/${prop.content.id.slice(-36)}/inbox?origin=${prop.content.id.getNodeOrigin()}`,
                    {
                        type: "follow",
                        summary: summary,
                        actor: user,
                        object: to_follow,
                    }
                ).then((resp) => {
                    setLoading(false);
                }).catch(error => {
                    alert("Failed to send followers request");
                });
        }).catch(error => {
            alert("Failed to get author data")
        });
    }

    function removeFollowing() {
        setFollowing(false);
        Ajax.delete(
            `service/authors/${prop.content.id.slice(-36)}/followers/${Identity.GetIdentity().id}?origin=${prop.content.id.getNodeOrigin()}&following=${otherId}&follower=${actor_id}`
        ).then(resp => {
            console.log("deleted")
            // window.location.reload();
        }).catch(error => {
            alert("Failed to remove follower.")
            setTimeout(()=>window.location.reload(), 4000);
        })
    }

    const renderCard = (card, index) => {
        return (
            <Card style = {{margin: '30px'}} key = {index}>
                <Card.Header>
                    Followers
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col>
                            <Card.Text>{card.displayName}</Card.Text>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
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
                                                followed ?
                                                    <Button onClick={removeFollowing}>
                                                        Unfriend
                                                    </Button>
                                                    :<Button onClick={removeFollowing}>
                                                        Unfollow
                                                    </Button>
                                                :<Button onClick={sendFollowRequest}>
                                                    {buttonText}
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
                                <Row>
                                    <Col>
                                        {
                                            followers.length > 0 ?
                                            followers.map(renderCard) :
                                            <h6>There is no follower.</h6>
                                        }
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