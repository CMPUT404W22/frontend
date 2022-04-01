import React, {useEffect, useState} from "react";

import "../../utility/NodeUtilities";
import {Button, Card} from "react-bootstrap";

function FollowingRequest(prop) {
    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <span style={{verticalAlign: "sub"}}>
                            {prop.summary}
                        </span>
                        <Button className={"float-end"}>Accept</Button>
                    </Card.Title>
                </Card.Body>
            </Card>
        </>
    );
}

export default FollowingRequest;