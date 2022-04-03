import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {fa0, fa4} from '@fortawesome/free-solid-svg-icons'
import {faFaceFrown} from '@fortawesome/free-regular-svg-icons'

function NotFound404() {
    return (
        <div style={{top: "35%", textAlign: "center", position: "absolute", width: "100%"}}>
            <FontAwesomeIcon icon={faFaceFrown} size={"5x"}/>
            <br/><br/>
            <FontAwesomeIcon icon={fa4} size={"4x"}/>
            <FontAwesomeIcon icon={fa0} size={"4x"}/>
            <FontAwesomeIcon icon={fa4} size={"4x"}/>
            <br/><br/>
            <div>
                <a className="link-secondary" href="/user-home" style={{marginRight: 10}}>
                    Go Home
                </a>
                <a className="link-secondary" href="javascript:history.back()" style={{marginLeft: 10}}>
                    Go Back
                </a>
            </div>
        </div>
    )
}

export default NotFound404;