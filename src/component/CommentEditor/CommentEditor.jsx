import React, {useEffect, useRef, useState} from "react";
import {Card, Container, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {v4 as uuidv4} from 'uuid';
import 'devextreme/dist/css/dx.light.css';
import HtmlEditor, {Item, MediaResizing, Toolbar} from 'devextreme-react/html-editor';
import {Ajax} from "../../utility/Ajax";
import LoadingIndicator from "../../component/LoadingIndicator/LoadingIndicator";
import Identity from "../../model/Identity";


function CommentEditor(prop) {
    const htmlEditor = useRef(null);

    const [postId, setPostId] = useState(uuidv4());

    // prop not null implies edit mode, set contents
    useEffect(() => {
        setPostId(prop.id.toString().slice(-36));
    }, [""])

    const [loading, setLoading] = useState(false);

    const headerValues = [false, 1, 2, 3, 4, 5];
    const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
    const fontValues = ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'];

    function handleSubmit(event) {
        let message = htmlEditor.current.instance.option("value");
        publishComment(message);

        event.preventDefault();
        event.stopPropagation();
    }

    function publishComment(content) {
        setLoading(true);
        if (prop.id.getNodeOrigin() === "local") {
            Ajax.post(
                `service/authors/${prop.id.getAuthorId()}/posts/${prop.id.getPostId()}/comments`,
                {
                    content: content
                }
            ).then((resp) => {
                window.location.reload();
            }).catch(error => {
                alert("Failed to post comment.");
            })
        } else {
            Ajax.get(`service/authors/${Identity.GetIdentity().id}`).then(resp => {
                resp.data["display_name"]= resp.data.displayName
                Ajax.post(
                    `service/authors/${prop.id.getAuthorId()}/inbox?origin=${prop.id.getNodeOrigin()}`,
                    {
                        "type": "comment",
                        "author": resp.data,
                        "comment": content,
                        "contentType": "text/plain",
                        "published": new Date().toISOString(),
                        "id": `${prop.id.split("author")[0]}authors/${prop.id.getAuthorId()}/posts/${prop.id.getPostId()}/comments/f6255bb01c648fe967714d52a89e8e9c`
                    }
                ).then((resp) => {
                    alert("comment sent to inbox");
                    setLoading(false);
                }).catch(error => {
                    alert("Failed to post comment.");
                })
            })
        }
    }

    return (
        <Container>
            <LoadingIndicator show={loading} disableScreen/>

            <Card style={{padding: "10px 10px"}}>
                <Card.Body>
                    <Row style={{paddingLeft: 12, paddingRight: 12}}>
                        <HtmlEditor ref={htmlEditor} height="200px" valueType="html">
                            <MediaResizing enabled={true}/>
                            <Toolbar multiline={false}>
                                <Item name="undo"/>
                                <Item name="redo"/>
                                <Item name="separator"/>
                                <Item
                                    name="size"
                                    acceptedValues={sizeValues}
                                />
                                <Item
                                    name="font"
                                    acceptedValues={fontValues}
                                />
                                <Item name="separator"/>
                                <Item name="bold"/>
                                <Item name="italic"/>
                                <Item name="strike"/>
                                <Item name="underline"/>
                                <Item name="separator"/>
                                <Item name="alignLeft"/>
                                <Item name="alignCenter"/>
                                <Item name="alignRight"/>
                                <Item name="alignJustify"/>
                                <Item name="separator"/>
                                <Item name="orderedList"/>
                                <Item name="bulletList"/>
                                <Item name="separator"/>
                                <Item
                                    name="header"
                                    acceptedValues={headerValues}
                                />
                                <Item name="separator"/>
                                <Item name="color"/>
                                <Item name="background"/>
                                <Item name="separator"/>
                                <Item name="link"/>
                                <Item name="image"/>
                                <Item name="separator"/>
                                <Item name="clear"/>
                                <Item name="codeBlock"/>
                                <Item name="blockquote"/>
                                <Item name="separator"/>
                                <Item name="insertTable"/>
                                <Item name="deleteTable"/>
                                <Item name="insertRowAbove"/>
                                <Item name="insertRowBelow"/>
                                <Item name="deleteRow"/>
                                <Item name="insertColumnLeft"/>
                                <Item name="insertColumnRight"/>
                                <Item name="deleteColumn"/>
                            </Toolbar>
                        </HtmlEditor>
                    </Row><br/>
                    <div className="d-grid gap-2">
                        <Button variant="primary" size="lg" onClick={handleSubmit}>
                            Add Comments
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default CommentEditor;
