import React, {useEffect, useState} from "react";

import {Ajax} from "../utility/Ajax";
import Identity from "../model/Identity";
import {Button, Col, Container, Row} from "react-bootstrap";
import LoadingIndicator from "../component/LoadingIndicator/LoadingIndicator";
import Post from "../component/Post/Post";
import Comment from "../component/Comment/Comment";
import FollowingRequest from "../component/FollowingRequest/FollowingRequest";
import Like from "../component/Like/Like";

function Inbox(prop) {
    const [loading, setLoading] = useState(false);
    const [inbox, setInbox] = useState([]);

    useEffect(() => {
        getNotifications();
    }, [""]);

    function deleteAllNotifications(){
        setLoading(true);
        Ajax.delete(
            `service/authors/${Identity.GetIdentity().id}/inbox`,
        ).then((resp) => {
            setLoading(false);
            window.location.reload();
        }).catch(error => {
            setLoading(false);
            alert("Failed to delete all notifications:", error);
        })
    }

    function getNotifications(){
        setLoading(true);

        Ajax.get(
            `service/authors/${Identity.GetIdentity().id}/inbox`,
        ).then((resp) => {
            console.log(resp.data.items)
            setInbox(resp.data.items);
            setLoading(false);
        }).catch(error => {
            setLoading(false);
            alert("Failed to get notifications");
            console.error(error);
        })
    }

    return (
        <Container>
            <LoadingIndicator show={loading} disableScreen/>
            <Row>
                <Col>
                    <Button variant="primary" className="float-end" onClick={deleteAllNotifications}>DELETE ALL</Button>
                </Col>
            </Row>

            <Row>
                <Col>
                    {
                        inbox.map(n => {
                            switch (n.type.toUpperCase()) {
                                case "LIKE":
                                    return (
                                        <Like
                                            author={n.author}
                                            object={n.object}
                                            summary={n.summary}
                                        />
                                    );
                                case "FOLLOW":
                                    return (
                                        <FollowingRequest
                                            actor={n.actor}
                                            object={n.object}
                                            summary={n.summary}
                                        />
                                    );
                                case "POST":
                                    return (
                                        <Post
                                            key={n.id}
                                            type={n.type}
                                            title={n.title}
                                            id={n.id}
                                            description={n.description}
                                            contentType={n.contentType}
                                            content={n.content}
                                            author={n.author}
                                            categories={n.categories}
                                            count={n.count}
                                            comments={n.comments}
                                            published={n.published}
                                            visibility={n.visibility}
                                            unlisted={n.unlisted}
                                            image={n.image}
                                            likeCount={n.likeCount}
                                            commentsSrc={n.commentsSrc}
                                        />
                                    );
                                case "COMMENT":
                                    return (
                                        <Comment
                                            key={n.id}
                                            author={n.author}
                                            content={n.comment}
                                            contentType={n.contentType}
                                            id={n.id}
                                            published={n.published}
                                            likeCount={n.likeCount}
                                        />
                                    );
                                default:
                                    alert("Invalid notification type");
                                    break;
                            }
                        })
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default Inbox;