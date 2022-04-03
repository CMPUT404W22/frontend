import React from "react";
import "../../utility/NodeUtilities";
import {Button, Card} from "react-bootstrap";
import {Ajax} from "../../utility/Ajax";

function FollowingRequest(prop) {
    let disableButtons = false;
    let summary = prop.summary;

    function getSummary(){
        return summary;
    }

    function setSummary(newSummary) {
        summary = newSummary;
    }

    function acceptFollowRequest(){        
        // 1. delete the request from FollowRequest table
        // 2. add follower to Following table
        const requestingAuthorId = prop.object.id.slice(-36);

        Ajax.delete(
            `service/authors/${Identity.GetIdentity().id}/followerRequests/${requestingAuthorId}`
        ).then((resp) => {
            disableButtons = true;

            Ajax.put(
                `service/authors/${Identity.GetIdentity().id}/followers/${requestingAuthorId}`
            ).then(() => {
                const newSummary = "Accepted " + prop.object.displayName + "'s follow request";
                setSummary(newSummary);

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
        const requestingAuthorId = prop.object.id.slice(-36);

        Ajax.delete(
            `service/authors/${Identity.GetIdentity().id}/followerRequests/${requestingAuthorId}`
        ).then((resp) => {
            const newSummary = "Declined " + prop.object.displayName + "'s follow request";
            setSummary(newSummary);

            disableButtons = true;
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
                            {getSummary}
                        </span>
                        <Button className={"float-end"} disabled={disableButtons} onClick={acceptFollowRequest}>Accept</Button>
                        <Button className={"float-end"} disabled={disableButtons} onClick={deleteFollowRequest}>Decline</Button>
                    </Card.Title>
                </Card.Body>
            </Card>
        </>
    );
}

export default FollowingRequest;
