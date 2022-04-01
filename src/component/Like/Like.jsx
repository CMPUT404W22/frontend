import React, {useEffect, useState} from "react";

import "../../utility/NodeUtilities";
import {Card} from "react-bootstrap";
import {Ajax} from "../../utility/Ajax";
import Post from "../Post/Post";

function Like(prop) {
    const [post, setPost] = useState(undefined);

    useEffect(() => {
        let author_id = prop.object.getAuthorId();
        let post_id = prop.object.getPostId();
        let origin = prop.object.getNodeOrigin();

        Ajax.get(`service/authors/${author_id}/posts/${post_id}?origin=${origin}`)
            .then((resp) => {
                setPost(resp.data);
            }).catch(error => {
            alert("Failed to get like's post");
        });

    }, [""])

    return (
        <>
            <Card style={{marginTop: 10, marginBottom: 10}}>
                <Card.Body>
                    <Card.Title>
                        {prop.summary}
                    </Card.Title>
                    <hr/>
                    {
                        post !== undefined ?
                            <Post
                                type={post.type}
                                title={post.title}
                                id={post.id}
                                description={post.description}
                                contentType={post.contentType}
                                content={post.content}
                                author={post.author}
                                categories={post.categories}
                                count={post.count}
                                comments={post.comments}
                                published={post.published}
                                visibility={post.visibility}
                                unlisted={post.unlisted}
                                image={post.image}
                                likeCount={post.likeCount}
                                commentsSrc={post.commentsSrc}
                            />
                            :
                            ""
                    }
                </Card.Body>
            </Card>
        </>
    );
}

export default Like;