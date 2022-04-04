import React, {useEffect, useState} from "react";
import "../../utility/NodeUtilities";
import {Button, Card} from "react-bootstrap";
import {Ajax} from "../../utility/Ajax";
import Identity from "../../model/Identity";

function FollowingRequest(prop) {
    const [disableButtons, setDisableButton] = useState(false);
    const [summary, setSummary] = useState("");

    // prop not null implies edit mode, set contents
    useEffect(() => {
        const requestingAuthorId = prop.actor.id.slice(-36);
        setSummary(prop.summary);

        Ajax.get(
            `service/authors/${Identity.GetIdentity().id}/followers/${requestingAuthorId}
                ?origin=local&actor_id=${prop.actor.id}&object_id=${prop.object.id}`
        ).then(resp => {
            if(resp.data == true){
                setSummary(prop.summary + " [ACCEPTED REQUEST]");
                setDisableButton(true);
            } else{
                setDisableButton(false);
            }
        }).catch(error => {
            setDisableButton(true);
            alert("Failed get request to service/authors/author_id/followers/requesting_author_id?origin=local");
            console.error("FollowingRequest useEffect: ", error);
        });
    }, [""])

    function acceptFollowRequest(){
        const requestingAuthorId = prop.actor.id.slice(-36);

        Ajax.put(
            `service/authors/${Identity.GetIdentity().id}/followers/${requestingAuthorId}`,
            {
                actor: prop.actor,
                object: prop.object
            }
        ).then(() => {
            setDisableButton(true);
            window.location.reload();
        }).catch(error => {
            alert("Failed to accept follow request");
            console.error("acceptFollowRequest, failed to send PUT: ", error);
        });
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <span style={{verticalAlign: "sub"}}>
                            {summary}
                        </span>
                        <Button className={"float-end"} disabled={disableButtons} onClick={acceptFollowRequest}>Accept</Button>
                    </Card.Title>
                </Card.Body>
            </Card>
        </>
    );
}

export default FollowingRequest;
