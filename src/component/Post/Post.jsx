import React, {useEffect, useState} from "react";

import {Card, Modal} from "react-bootstrap";

import DOMPurify from 'dompurify';

import ReactCommonmark from "react-commonmark";

import PostEditor from "../PostEditor/PostEditor";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil} from "@fortawesome/free-solid-svg-icons";

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
        getComments();
    }, [""]);

    function displayProfile(){
        if (prop.author.id.slice(-36) === Identity.GetIdentity().id) {
            window.location.assign("/user-profile");
        } else {
            setShowProfile(true);
        }
    }

    function likePost() {
        Ajax.post(
            `service/authors/${Identity.GetIdentity().id}/posts/${prop.id.slice(-36)}/likes?origin=${prop.id.getNodeOrigin()}`,
            {}
        ).then((resp) => {
            if (resp.data.created) {
                setLikeCount(likeCount + 1);
            } else {
                setLikeCount(likeCount - 1);
            }
        }).catch(error => {
           alert("Failed to like post");
        });
    }

    function openComments() {
        setShowComments(true);
        setCommentElements(
            <>
                {comments.map(c => {
                    return (
                        <Comment
                            key={c.id}
                            author={c.author}
                            content={c.comment}
                            contentType={c.contentType}
                            id={c.id}
                            published={c.published}
                        />
                    );
                })}
            </>
        );
    }

    function getComments() {
        Ajax.get(`service/authors/${Identity.GetIdentity().id}/posts/${prop.id.slice(-36)}/comments?origin=${prop.id.getNodeOrigin()}&page=0&size=9999`)
            .then((resp) => {
                setComments(resp.data.comments);
            })
            .catch(error => {
                alert("Failed to get comments.");
            });
    }

    return (
        <>
            <Modal show={showEditor} onHide={()=>setShowEditor(false)} fullscreen>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <PostEditor content={prop}/>
                </Modal.Body>
            </Modal>

            <Modal show={showProfile} onHide={()=>setShowProfile(false)} fullscreen>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Profile content={prop.author}/>
                </Modal.Body>
            </Modal>

            <Modal show={showComments} onHide={()=>setShowComments(false)} fullscreen>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    {commentElements}
                    <CommentEditor id={prop.id}/>
                </Modal.Body>
            </Modal>

            <Card style={{marginTop: 10, marginBottom: 10}}>
                <Card.Body>
                    <Card.Title>
                        {prop.title}{" "}
                        <i className="text-muted" style={{fontSize: 13}}>
                            by{" "}
                            <a className="hover" style={{color: "grey", textDecoration: "underline"}} onClick={displayProfile}>
                                {prop.author.displayName ?? prop.author.display_name}
                            </a>
                        </i>
                        {prop.author.id.slice(-36) === Identity.GetIdentity().id ?
                            <FontAwesomeIcon icon={faPencil}
                                             className="float-end hover"
                                             color="grey"
                                             onClick={()=>setShowEditor(true)}
                            />
                            :
                            ""
                        }
                    </Card.Title>

                    <span className="text-muted" style={{fontSize: 10}}>{prop.description}</span>
                    <hr/>
                    {content}
                </Card.Body>
                <Card.Footer>
                    <span className="text-muted" style={{fontSize: 10}}>{new Date(Date.parse(prop.published)).toString()}</span>
                    <span className="float-end hover" onClick={likePost} style={{textDecoration: "underline"}}>{likeCount}  likes</span>
                    <div>
                        <span className="text-muted" style={{fontSize: 10}}>{prop.categories?.toString() ?? ""}</span>
                        <span className="float-end hover" onClick={openComments} style={{textDecoration: "underline"}}>{prop.count}  comments</span>
                    </div>
                </Card.Footer>
            </Card>
        </>
    );
}

export default Post;