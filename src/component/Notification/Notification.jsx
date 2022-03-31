import {Container, Button} from "react-bootstrap";
import {Ajax} from "../../utility/Ajax";
import Identity from "../../model/Identity";
import {useEffect, useState} from "react";
import LoadingIndicator from "../../component/LoadingIndicator/LoadingIndicator";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import "./Notification.css";



function Notification(prop) {
    const index = 0;
    const [loading, setLoading] = useState(false);
    const [inbox, setInbox] = useState("");

    useEffect(() => {
        getNotifications();
    }, []);

    function deleteAllNotifications(){
        setLoading(true);
        Ajax.delete(
            `service/authors/${Identity.GetIdentity().id}/inbox`,
        ).then((resp) => {
            setLoading(false);
            window.location.reload();
        }).catch(error => {
            setLoading(false);
            alert("Failed to delete all notifications:", error);
        })
    }

    function getNotifications(){
        setLoading(true);

        Ajax.get(
            `service/authors/${Identity.GetIdentity().id}/inbox`,
        ).then((resp) => {
            const items = resp.data.items;

            if(items.length === 0){
                setInbox(<ListItemText primary={"Your inbox is empty"} />);
                setLoading(false);
                return;
            }

            var children = [];

            for (var i = 0; i < items.length; i++) {
                const type = items[i]["type"].toUpperCase();
                let text = type + ": ";

                if(type === "LIKE" || type === "FOLLOW"){
                    text += items["summary"];
                } else if(type === "POST"){
                    text += `${items["author"]["displayName"]} made a post: "${items["title"]}"`;
                } else if(type === "COMMENT"){
                    text += `${items["author"]["displayName"]} commented: "${items["comment"]}"`;
                } else {
                    throw new Error("invalid notification type saved in db");
                }

                children.push(
                    <ListItemButton>
                        <ListItemText primary={text} />
                    </ListItemButton>
                );
            }

            setInbox(<div id="notification-list">{children}</div>);
            setLoading(false);
            window.location.reload();
        }).catch(error => {
            setLoading(false);
            alert("Failed to get notifications: ", error);            
        })
    }

    return (
    <Container>
        <LoadingIndicator show={loading} disableScreen/>
        {/* <Button id="delete-all" onClick={deleteAllNotifications()}>DELETE ALL</Button> */}

        
        Here are your notifications:

        <ListItem component="div" disablePadding>
            {inbox}
        </ListItem>
    </Container>
    )
}

export default Notification;
