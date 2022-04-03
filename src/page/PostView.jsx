import React, {useEffect, useState} from "react";

import {Container} from "react-bootstrap";
import {Ajax} from "../utility/Ajax";
import Post from "../component/Post/Post";

function PostView(prop) {
    const [post, setPost] = useState(null);

    useEffect(() => {
        Ajax.get(`service/post${window.location.search}`).then(resp => {
            console.log(resp.data);
            setPost(resp.data);
        }).catch(error => {
            alert("Failed to get post, check your url");
        })
    }, [""]);

    return (
        <Container>
            {post !== null ?
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
        </Container>
    )
}

export default PostView;