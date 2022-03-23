import React, { useState } from "react";

import {Button, Card, Container, Placeholder} from "react-bootstrap";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Switch from '@mui/material/Switch';


import { Link } from 'react-router-dom';

import axios from "axios";
import CardBody from "./styles/cardBody";
import GridContainer from "./styles/GridContainer";
import GridItem from "./styles/GridItem";
import CustomInput from "./styles/costumInput";
import Identity from "../model/Identity";


let identity = Identity.GetIdentity();
function CreatePost(prop) {
    const [username, setUsername] = useState(identity.username);
    const [userID, setUserID] = useState("732ea04f-20ed-431c-90b4-342195bf74c8");
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("")
    const [visibility, setVisibility] = useState(0)
    const [content, setContent] = useState("")
    const [description, setDescription] = useState("")
    const [checked, setChecked] = useState(true);
    const [image, setimage] = useState([])

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (checked){
            setVisibility(0)
        }else{
            setVisibility(1)
        }
        let data = {
            title : title,
            visibility: visibility,
            content: content,
            description: description,
            categories: [],
            image: image,
            unlisted: false
        }
        try {
            console.log("start")
            await axios.post(`http://127.0.0.1:8000/service/authors/${userID}/posts/`, data, config)
            console.log("Success!")
            setOpen(true)
    
           window.history.back("/home")
        } catch (error) {
            console.log(error.message);
            setOpen(true)
        }
    }

    const handleCancle = async (e) => {
        window.history.back("/home")
    }

    const handleChange = (event) => {
        setChecked(event.target.checked);
      };

    function onimageChange(e) {
        setimage([...e.target.files])
    }

    return (
        <Container>
            <h1>Create New Post</h1>
            <h5>Post Holder : {username}</h5>
            <Card profile>
                <CardBody profile>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                            labelText="Post Title"
                            id="postTitle"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                "data-testid": "test-title",
                                value: title,
                                onChange: (e) => setTitle(e.target.value)
                            }}
                        />
                    </GridItem>
                    <FormGroup sx={{margin: 2 }}>
                        <FormLabel component="legend" sx={{fontSize: 12}}>Visibility</FormLabel>
                        <FormControlLabel 
                        sx={{marginLeft: 2 }}
                        control={<Switch checked={checked}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }} />} label="Public" />
                    </FormGroup>
                    <GridItem xs={12} sm={12} md={10}>
                        <CustomInput
                            labelText="Description"
                            id="description"
                            multiline
                            rows={2}
                            inputProps={{
                                "data-testid": "test-des",
                                value: description,
                                onChange: (e) => setDescription(e.target.value),
                                multiline: true,
                                rows: 3,
                                variant: 'outlined'
                            }}
                            formControlProps={{
                                fullWidth: true
                            }}
                        />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                            labelText="Post Content"
                            id="content"
                            multiline
                            rows={4}
                            inputProps={{ 
                                "data-testid": "test-contennt",
                                value: content,
                                onChange: (e) => setContent(e.target.value),
                                multiline: true,
                                rows: 5,
                                variant: 'outlined'
                            }}
                            formControlProps={{
                                fullWidth: true,
                            }}
                        />
                    </GridItem>
                </GridContainer>
                <Button color="primary" round onClick={handleSubmit} >
                    Submit
                </Button>
                <Button color="primary" round onClick={handleCancle}>
                    Cancel
                </Button>
                </CardBody>
            </Card>
        </Container>
    )
}

export default CreatePost;