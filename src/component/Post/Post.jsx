import React, {useEffect, useState} from "react";

import {Card, Col, Modal, Row, Form, InputGroup} from "react-bootstrap";

import DOMPurify from 'dompurify';

import ReactCommonmark from "react-commonmark";

import PostEditor from "../PostEditor/PostEditor";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faTrashCan, faShareNodes, faCopy} from "@fortawesome/free-solid-svg-icons";

import "../../utility/NodeUtilities";

import Identity from "../../model/Identity";

import "./Post.css";
import Profile from "../Profile/Profile";
import {Ajax} from "../../utility/Ajax";
import CommentEditor from "../CommentEditor/CommentEditor";
import Comment from "../Comment/Comment";

function Post(prop) {
    const [content, setContent] = useState(<></>);
    const [showEditor, setShowEditor] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentElements, setCommentElements] = useState(<></>);
    const [showSharing, setShowSharing] = useState(false);

    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        // process post content
        switch (prop.contentType){
            case "text/plain":
                setContent(<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(prop.content)}}/>);
                break;
            case "text/markdown":
                setContent(<ReactCommonmark source={prop.content} />);
                break;
            case "application/base64":
            case "image/png;base64":
            case "image/jpeg;base64":
                setContent(<img src={prop.content} alt={""}/>);
                break;
            default:
                setContent(<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(prop.content)}}/>);
        }

        // set like counts
        setLikeCount(prop.likeCount);

        // get comments
        if (prop.commentsSrc !== undefined) {
            setComments(prop.commentsSrc.comments ?? prop.commentsSrc);
        } else {
            getComments();
        }

        // get likes
        if (prop.id.getNodeOrigin() !== "local") getLikes();
    }, [""]);

    function displayProfile(){
        if (prop.author.id.slice(-36) === Identity.GetIdentity().id) {
            window.location.assign("/user-profile");
        } else {
            setShowProfile(true);
        }
    }

    function likePost() {
        Ajax.get(
            `service/authors/${Identity.GetIdentity().id}`
        ).then((resp) => {
            Ajax.post(
                `service/authors/${prop.author.id.getAuthorId()}/inbox?origin=${prop.author.id.getNodeOrigin()}`,
                {
                    type: "like",
                    author: resp.data,
                    object: prop.id,
                    "@context": "https://www.w3.org/ns/activitystreams",
                    summary: `${resp.data.displayName} liked your post`
                }
            ).then(resp => {
                setLikeCount(likeCount + 1);
            }).catch(error => {
                alert("You already liked this post");
            })
        }).catch(error => {
           alert("Failed to like post");
        });
    }

    function openComments() {
        setShowComments(true);
        setCommentElements(
            <>
                {comments.map(c => {
                    console.log(c)
                    return (
                        <Comment
                            key={c.id}
                            author={c.author}
                            content={c.comment}
                            contentType={c.contentType}
                            id={c.id}
                            published={c.published}
                            likeCount={c.likeCount}
                        />
                    );
                })}
            </>
        );
    }

    function getComments() {
        Ajax.get(`service/authors/${prop.id.getAuthorId()[0]}/posts/${prop.id.getPostId()[0]}/comments?origin=${prop.id.getNodeOrigin()}&page=0&size=9999`)
            .then((resp) => {
                setComments(resp.data.comments ?? resp.data.items);
            })
            .catch(error => {
                alert("Failed to get comments.");
            });
    }

    function getLikes() {
        Ajax.get(`service/authors/${prop.id.getAuthorId()[0]}/posts/${prop.id.getPostId()[0]}/likes?origin=${prop.id.getNodeOrigin()}`)
            .then((resp) => {
                let likes = resp.data.items ?? resp.data.likes ?? undefined
                setLikeCount(likes.length);
            })
            .catch(error => {
                alert("Failed to get likes.");
                console.log(error)
            });
    }

    function getFriends() {
        Ajax.get(`service/authors/${Identity.GetIdentity().id}/friends`)
    }

    function deletePost() {
        Ajax.delete(
            `service/authors/${Identity.GetIdentity().id}/posts/${prop.id.slice(-36)}}`
        ).then((resp) => {
            window.location.reload();
        }).catch(error => {
            alert("Failed to deleted post");
        });
    }

    function sharePostToAuthor() {
        setShowSharing(true);
    }

    return (
        <>
            {/* Post editor modal */}
            <Modal show={showEditor} onHide={()=>setShowEditor(false)} fullscreen>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <PostEditor content={prop}/>
                </Modal.Body>
            </Modal>

            {/* User profile modal */}
            <Modal show={showProfile} onHide={()=>setShowProfile(false)} fullscreen>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Profile content={prop.author}/>
                </Modal.Body>
            </Modal>

            {/* Comments modal */}
            <Modal show={showComments} onHide={()=>setShowComments(false)} fullscreen>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    {commentElements}
                    {
                        prop.id.getNodeOrigin() === "local" ?
                            <CommentEditor id={prop.id}/>
                            :
                            ""
                    }
                </Modal.Body>
            </Modal>

            {/* Sharing modal */}
            <Modal show={showSharing} onHide={()=>setShowSharing(false)} centered>
                <Modal.Header closeButton>
                    Sharing
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <InputGroup>
                                <Form.Control id="sharable-link" type="text" value={`${window.location.host}/post/?post=${prop.id.slice(-36)}&author=${prop.id.getAuthorId()}&origin=${prop.id.getNodeOrigin()}`} disabled/>
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faCopy}
                                                     color={"grey"}
                                                     className="hover"
                                                     onClick={()=>{
                                                         let copyText = document.getElementById("sharable-link");
                                                         copyText.select();
                                                         copyText.setSelectionRange(0, 99999);
                                                         navigator.clipboard.writeText(copyText.value).then(() => console.log("Link Copied: " + copyText.value));
                                                     }}
                                    />
                                </InputGroup.Text>
                            </InputGroup>
                        </Col>
                        <Row>

                        </Row>
                    </Row>
                </Modal.Body>
            </Modal>

            <Card style={{marginTop: 10, marginBottom: 10}}>
                <Card.Body>
                    <Card.Title>
                        {prop.title}{" "}
                        <i className="text-muted" style={{fontSize: 13}}>
                            by{" "}
                            <a className="hover" style={{color: "grey", textDecoration: "underline"}} onClick={displayProfile}>
                                {prop.author.displayName ?? prop.author.display_name ?? "Unknown Author"}
                            </a>
                        </i>
                        <div className="float-end">
                            <FontAwesomeIcon icon={faShareNodes}
                                             className="hover"
                                             color="grey"
                                             style={{marginRight: 10}}
                                             onClick={()=>setShowSharing(true)}
                            />
                            {prop.author.id.slice(-36) === Identity.GetIdentity().id ?
                                <>
                                    <FontAwesomeIcon icon={faPencil}
                                                     className="hover"
                                                     color="grey"
                                                     style={{marginRight: 10}}
                                                     onClick={()=>setShowEditor(true)}
                                    />
                                    <FontAwesomeIcon icon={faTrashCan}
                                                     className="hover"
                                                     color="grey"
                                                     onClick={deletePost}
                                    />
                                </>
                                :
                                ""
                            }
                        </div>
                    </Card.Title>

                    <span className="text-muted" style={{fontSize: 10}}>{prop.description}</span>
                    <hr/>
                    {content}
                </Card.Body>
                <Card.Footer>
                    <span className="text-muted" style={{fontSize: 10}}>{new Date(Date.parse(prop.published)).toString()}</span>
                    <span className="float-end hover" onClick={likePost} style={{textDecoration: "underline"}}>{likeCount ?? "Unknown"}  likes</span>
                    <div>
                        <span className="text-muted" style={{fontSize: 10}}>{prop.categories?.toString() ?? ""}</span>
                        <span className="float-end hover" onClick={openComments} style={{textDecoration: "underline"}}>{comments?.length ?? prop.count}  comments</span>
                    </div>
                </Card.Footer>
            </Card>
        </>
    );
}

export default Post;