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

function Comment(prop) {
    const [showProfile, setShowProfile] = useState(false);
    const [content, setContent] = useState(<></>);

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
    }, [""]);

    function displayProfile(){
        if (prop.author.id.slice(-36) === Identity.GetIdentity().id) {
            window.location.assign("/user-profile");
        } else {
            setShowProfile(true);
        }
    }

    function likeComment() {
        Ajax.post(
            `service/authors/${Identity.GetIdentity().id}/posts/${prop.id.slice(-36)}/likes?origin=${prop.id.getNodeOrigin()}`,
            {}
        ).then((resp) => {

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
                </Card.Footer>
            </Card>
        </>
    );
}

export default Comment;