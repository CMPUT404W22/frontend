import {Container} from "react-bootstrap";
import {Ajax} from "../../utility/Ajax";
import Identity from "../../model/Identity";
import {useState} from "react";
import LoadingIndicator from "../../component/LoadingIndicator/LoadingIndicator";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

function Notification(prop) {
    const index = 0;
    const [loading, setLoading] = useState(false);


    function deleteAllNotifications(){
        Ajax.delete(
            `service/authors/${Identity.GetIdentity().id}/inbox`,
        ).then((resp) => {
            window.location.reload();
        }).catch(error => {
            alert("Failed to delete all notifications:", error);
        })
    }

    function getNotifications(){
        var result;

        Ajax.get(
            `service/authors/${Identity.GetIdentity().id}/inbox`,
        ).then((resp) => {
            const items = resp.data.items;

            if(items.length === 0){
                return <ListItemText primary={"Your inbox is empty"} />;
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

            return (<div>{children}</div>);
        }).catch(error => {
            alert("Failed to get notifications: ", error);
        })
    }

    function viewNotificationOnClick(){

    }

    return (
    <Container>
        <LoadingIndicator show={loading} disableScreen/>

        
        Here are your notifications:

        <ListItem component="div" disablePadding>
            {getNotifications()}
        </ListItem>
    </Container>
    )
}

export default Notification;
