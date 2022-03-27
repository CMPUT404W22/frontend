import React, {useEffect, useState} from "react";

import {Button, Card, Container, Modal} from "react-bootstrap";
import {Ajax} from "../utility/Ajax";
import Post from "../component/Post/Post";
import PostEditor from "../component/PostEditor/PostEditor";
import LoadingIndicator from "../component/LoadingIndicator/LoadingIndicator";

function Home(prop) {
    // region Load posts
    const [mode, setMode] = useState("home");
    const [posts, setPosts] = useState([]);
    useEffect(()=>{
        setLoading(true);
        if (mode === "home") {
            Ajax.get(`service/authors/${localStorage.getItem("id")}/posts/home?type=all`)
                .then((resp) => {
                    setPosts(resp.data);
                    setLoading(false);
                }).catch(()=>alert("Error getting homepage content"));
        } else {
            Ajax.get(`service/authors/${localStorage.getItem("id")}/posts/home?type=explore`)
                .then((resp) => {
                    setPosts(resp.data);
                    setLoading(false);
                }).catch(()=>alert("Error getting homepage content"));
        }
    }, ["", mode])
    // endregion

    // region Create new post
    const [showNewPostModal, setShowNewPostModal] = useState(false);
    // endregion

    const [loading, setLoading] = useState(false);

    return (
        <Container>
            <LoadingIndicator show={loading} disableScreen />
            <Button onClick={()=>setShowNewPostModal(true)} style={{marginRight: 10}}>
                New Post
            </Button>
            {mode === "home" ?
                <Button onClick={()=>setMode("explore")}>
                    Explore
                </Button>
                :
                <Button onClick={()=>setMode("home")}>
                    Home
                </Button>
            }


            <Modal show={showNewPostModal} onHide={()=>setShowNewPostModal(false)} fullscreen>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <PostEditor />
                </Modal.Body>
            </Modal>

            {
                posts.length > 0 ?
                    posts.map(p => {
                        return (
                            <Post
                                key={p.id}
                                type={p.type}
                                title={p.title}
                                id={p.id}
                                description={p.description}
                                contentType={p.contentType}
                                content={p.content}
                                author={p.author}
                                categories={p.categories}
                                count={p.count}
                                comments={p.comments}
                                published={p.published}
                                visibility={p.visibility}
                                unlisted={p.unlisted}
                                image={p.image}
                                likeCount={p.likeCount}
                                commentsSrc={p.commentsSrc}
                            />
                        )
                    })
                    :
                    <p className="text-center">Nothing to see here, follow someone or make a post.</p>
            }
        </Container>
    );
}

export default Home;