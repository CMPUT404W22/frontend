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
            `service/authors/${Identity.GetIdentity().id}/followerRequests/${requestingAuthorId}`
        ).then(resp => {
            if(resp.data.length > 0){
                setDisableButton(false);        
            } else{
                setSummary(prop.summary + " [ACTION COMPLETED]");
                setDisableButton(true);
            }
        }).catch(error => {
            setDisableButton(true);
            alert("Failed to get follow request");
            console.error("FollowingRequest useEffect: ", error);
        });
    }, [""])

    function acceptFollowRequest(){        
        // 1. delete the request from FollowRequest table
        // 2. add follower to Following table
        const requestingAuthorId = prop.actor.id.slice(-36);

        Ajax.delete(
            `service/authors/${Identity.GetIdentity().id}/followerRequests/${requestingAuthorId}`
        ).then((resp) => {
            setDisableButton(true);

            Ajax.put(
                `service/authors/${Identity.GetIdentity().id}/followers/${requestingAuthorId}`
            ).then(() => {
                alert("Accepted follow request");
                window.location.reload();
            }).catch(error => {
                alert("Failed to accept follow request");
                console.error("acceptFollowRequest, failed to send PUT: ", error);
            });

        }).catch(error => {
            alert("Failed to accept follow request");
            console.error("acceptFollowRequest, failed to send DELETE: ", error);
        });
    }

    function deleteFollowRequest(){
        const requestingAuthorId = prop.actor.id.slice(-36);

        Ajax.delete(
            `service/authors/${Identity.GetIdentity().id}/followerRequests/${requestingAuthorId}`
        ).then((resp) => {
            alert("Declined follow request");
            setDisableButton(true);
            window.location.reload();
        }).catch(error => {
            alert("Failed to delete follow request");
            console.error("deleteFollowRequest: ", error);
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
                        <Button className={"float-end"} disabled={disableButtons} onClick={deleteFollowRequest} style={{background:"red"}}>Decline</Button>
                    </Card.Title>
                </Card.Body>
            </Card>
        </>
    );
}

export default FollowingRequest;
