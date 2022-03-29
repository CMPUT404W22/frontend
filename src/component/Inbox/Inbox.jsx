import {Container} from "react-bootstrap";

function Inbox(prop) {
    function deleteAllNotifications(){
        setLoading(true);
        Ajax.delete(
            `service/authors/${Identity.GetIdentity().id}/inbox`,
        ).then((resp) => {
            window.location.reload();
        }).catch(error => {
            alert("Failed to delete all notifications:", error);
        })
    }

    function getNotifications(){
        setLoading(true);
        Ajax.get(
            `service/authors/${Identity.GetIdentity().id}/inbox`,
        ).then((resp) => {
            window.location.reload();
        }).catch(error => {
            alert("Failed to get notifications:", error);
        })
    }

    function addNotification(){
        setLoading(true);
        Ajax.post(
            `service/authors/${Identity.GetIdentity().id}/inbox`,
            {
                content: content
            }
        ).then((resp) => {
            window.location.reload();
        }).catch(error => {
            alert("Failed to add notification:", error);
        })
    }

    function viewNotificationOnClick(){

    }

    return (<Container>New inbox container</Container>)
}