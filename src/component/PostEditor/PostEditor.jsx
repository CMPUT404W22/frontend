import React, {useEffect, useRef, useState} from "react";
import {Card, Col, Container, FloatingLabel, Form, Row, Toast, ToastContainer} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { v4 as uuidv4 } from 'uuid';
import 'devextreme/dist/css/dx.light.css';
import HtmlEditor, { Toolbar, MediaResizing, Item } from 'devextreme-react/html-editor';
import {Ajax} from "../../utility/Ajax";
import LoadingIndicator from "../../component/LoadingIndicator/LoadingIndicator";


function PostEditor(prop) {
    const htmlEditor = useRef(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [unlisted, setUnlisted] = useState(false);
    const [publiclyVisible, setPubliclyVisible] = useState(true);
    const [postId, setPostId] = useState(uuidv4());

    // prop not null implies edit mode, set contents
    useEffect(() => {
        if (prop.content != null) {
            setTitle(prop.content.title);
            setDescription(prop.content.description);
            setCategory(prop.content.categories.toString());
            setUnlisted(prop.content.unlisted);
            setPubliclyVisible(prop.content.visibility);
            setPostId(prop.content.id.toString().slice(-36));
            htmlEditor.current.instance.option("value", prop.content.content);
        }
    }, [""])

    const [validated, setValidated] = useState(false);

    const [loading, setLoading] = useState(false);

    const headerValues = [false, 1, 2, 3, 4, 5];
    const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
    const fontValues = ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'];

    function handleSubmit(event) {
        const form = event.currentTarget;
        let message = htmlEditor.current.instance.option("value");
        if (form.checkValidity() === true && message !== "") {
            publishPost(message);
        }

        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
    }

    function publishPost(content) {
        setLoading(true);
        let categories = []
        category.split(",").forEach(c => {
            categories.push(c.trim())
        })
        Ajax.post(
            `service/authors/${localStorage.getItem("id")}/posts/${postId}`,
            {
                title: title,
                description: description,
                content: content,
                visibility: publiclyVisible ? "Public" : "Friends",
                unlisted: unlisted,
                categories: categories
            }
        ).then((resp)=>{
            setLoading(false);
            window.location.reload();
        }).catch((error)=>{
            alert("Failed to publish post");
            setLoading(false);
        });
    }

    return (
        <Container>
            <LoadingIndicator show={loading} disableScreen/>

            <Card style={{padding: "10px 10px"}}>
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Col>
                                <FloatingLabel controlId="title" label="Title">
                                    <Form.Control required
                                                  type="text"
                                                  value={title}
                                                  onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a title
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel controlId="description" label="Description">
                                    <Form.Control required
                                                  type="text"
                                                  value={description}
                                                  onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid description
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                        </Row><br/>
                        <Row>
                            <Col>
                                <FloatingLabel controlId="category" label="Category | CSV">
                                    <Form.Control required
                                                  type="text"
                                                  value={category}
                                                  onChange={(e) => setCategory(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide valid categories
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <Form>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label="Unlisted"
                                        checked={unlisted}
                                        onChange={(e) => setUnlisted(e.target.checked)}
                                    />
                                </Form>
                                <Form>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        label="Public"
                                        checked={publiclyVisible}
                                        onChange={(e) => setPubliclyVisible(e.target.checked)}
                                    />
                                </Form>
                            </Col>
                        </Row><br/>
                        <Row style={{paddingLeft: 12, paddingRight: 12}}>
                            <HtmlEditor ref={htmlEditor} height="725px" valueType="html">
                                <MediaResizing enabled={true} />
                                <Toolbar multiline={false}>
                                    <Item name="undo" />
                                    <Item name="redo" />
                                    <Item name="separator" />
                                    <Item
                                        name="size"
                                        acceptedValues={sizeValues}
                                    />
                                    <Item
                                        name="font"
                                        acceptedValues={fontValues}
                                    />
                                    <Item name="separator" />
                                    <Item name="bold" />
                                    <Item name="italic" />
                                    <Item name="strike" />
                                    <Item name="underline" />
                                    <Item name="separator" />
                                    <Item name="alignLeft" />
                                    <Item name="alignCenter" />
                                    <Item name="alignRight" />
                                    <Item name="alignJustify" />
                                    <Item name="separator" />
                                    <Item name="orderedList" />
                                    <Item name="bulletList" />
                                    <Item name="separator" />
                                    <Item
                                        name="header"
                                        acceptedValues={headerValues}
                                    />
                                    <Item name="separator" />
                                    <Item name="color" />
                                    <Item name="background" />
                                    <Item name="separator" />
                                    <Item name="link" />
                                    <Item name="image" />
                                    <Item name="separator" />
                                    <Item name="clear" />
                                    <Item name="codeBlock" />
                                    <Item name="blockquote" />
                                    <Item name="separator" />
                                    <Item name="insertTable" />
                                    <Item name="deleteTable" />
                                    <Item name="insertRowAbove" />
                                    <Item name="insertRowBelow" />
                                    <Item name="deleteRow" />
                                    <Item name="insertColumnLeft" />
                                    <Item name="insertColumnRight" />
                                    <Item name="deleteColumn" />
                                </Toolbar>
                            </HtmlEditor>
                        </Row><br/>
                        <div className="d-grid gap-2">
                            <Button variant="primary" size="lg" type="submit">
                                Publish
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default PostEditor;
