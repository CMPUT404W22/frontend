import React, {useEffect, useState} from "react";

import {Card, Modal} from "react-bootstrap";

import DOMPurify from 'dompurify';

import ReactCommonmark from "react-commonmark";

import "../../utility/NodeUtilities";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";

import Identity from "../../model/Identity";

import Profile from "../Profile/Profile";
import {Ajax} from "../../utility/Ajax";
import {set} from "devextreme/events/core/events_engine";

function Comment(prop) {
    const [showProfile, setShowProfile] = useState(false);
    const [content, setContent] = useState(<></>);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        // set like count
        if (prop.likeCount === undefined){
            getCommentLikes()
            //setLikeCount(prop.likeCount)
        } else {
            setLikeCount(prop.likeCount)
        }
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
    }, [""]);

    function displayProfile(){
        if (prop.author.id.slice(-36) === Identity.GetIdentity().id) {
            window.location.assign("/user-profile");
        } else {
            setShowProfile(true);
        }
    }

    function getCommentLikes() {
        console.log(prop.id)
        Ajax.get(`service/authors/${prop.id.getAuthorId()}/posts/${prop.id.getPostId()}/comments/${prop.id.getCommentId()}/likes?origin=${prop.author.id.getNodeOrigin()}`)
            .then((resp) => {
                let likes = resp.data.items ?? resp.data.likes ?? undefined
                setLikeCount(likes.length);
            })
            .catch(error => {
                alert("Comment from unknown node. Unable to get likes.");
                console.log(error)
            });
    }

    function likeComment() {
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
                    summary: `${resp.data.displayName} liked your comment`
                }
            ).then(resp => {
                setLikeCount(likeCount + 1);
            }).catch(error => {
                alert("You already liked this comment");
            })
        }).catch(error => {
            alert("Failed to like comment");
        });
    }

    function deleteComment() {
        Ajax.delete(
            `service/authors/${Identity.GetIdentity().id}/posts/${prop.id.slice(-36)}/comments/${prop.id.slice(-36)}`
        ).then((resp) => {
            window.location.reload();
        }).catch(error => {
            alert("Failed to delete comment");
        });
    }

    return (
        <>
            <Modal show={showProfile} onHide={()=>setShowProfile(false)} fullscreen>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Profile content={prop.author}/>
                </Modal.Body>
            </Modal>

            <Card style={{marginTop: 10, marginBottom: 10}}>
                <Card.Body>
                    <Card.Title>
                        <a className="hover" style={{textDecoration: "underline"}} onClick={displayProfile}>
                            {prop.author.displayName ?? prop.author.display_name}
                        </a>
                        {
                            prop.author.id.slice(-36) === Identity.GetIdentity().id ?
                                <a className="float-end" onClick={deleteComment}>
                                    <FontAwesomeIcon icon={faTrashCan} color="grey"/>
                                </a>
                                :
                                ""
                        }

                    </Card.Title>
                    <hr/>
                    {content}
                </Card.Body>
                <Card.Footer>
                    <span className="text-muted" style={{fontSize: 10}}>{new Date(Date.parse(prop.published)).toString()}</span>
                    <a className="float-end hover" onClick={likeComment}>{likeCount ?? "Unknown"} likes</a>
                </Card.Footer>
            </Card>
        </>
    );
}

export default Comment;