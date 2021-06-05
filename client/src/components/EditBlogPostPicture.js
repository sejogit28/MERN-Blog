import React ,{useState, useContext, useEffect, useRef} from 'react';
import {Grid, Form, Button, Divider, Image, Card} from 'semantic-ui-react';
import BlogCard from './BlogMainPageCard';

import PopupMessage from './PopupMessage';

import BlogPostService from '../Services/BlogPostService';




const EditBlogPostPicture = props => {

    
    const [imageUrl, setImageUrl] = useState("");
    const [file, setFile] = useState();
    const [blogPost, setBlogPost] = useState();
    const [message, setMessage] = useState(
    {
        icon: "",
        hidden: true,
        positive: false,
        negative: false,
        header: "",
        content: ""
    });
    let timerID = useRef(null);


    const dismissMessage = () => 
    {
        setMessage(
        {
            icon: "",
            hidden: true,
            positive: false,
            negative: false,
            header: "",
            content: ""
        })
    }

    const onFileChange = e => 
    {
        setFile(e.target.files[0]);
    } 

    const id = props.match.params.id;

   

    useEffect(() => {
        BlogPostService.getBlogPost(id)
        .then(data=>
            {
                setBlogPost(data);
                setImageUrl(data.imageUrl);
                console.log(data);
            });
    }, [id]);


    const onSubmitForm = e => 
    {
        e.preventDefault();
         const formData = new FormData();
         formData.append("imageUrl", imageUrl);
         formData.append('blogImage', file);
         BlogPostService.editBlogPostPic(id, formData).then(data =>
         {

            console.log(data);
            BlogPostService.getBlogPost(id)
            .then(data=>
            {
                setBlogPost(data);
                setImageUrl(data.imageUrl);
                console.log(data);
            });
            //props.history.push('/admin');                 
         });

    }


    return (
        <>
            <Grid padded="vertically">
                <Grid.Row centered>
                    <h1>
                        Edit This Post Pic!!
                    </h1>
                </Grid.Row>


                <Grid.Row>
                   { blogPost &&
                   <Card.Group >
                    <BlogCard  fluidTrue={false} blogpost={blogPost}/>
                    </Card.Group>
                    }
                </Grid.Row>

            
           

               

            <Grid.Row>
                <Grid.Column>
                    <Form onSubmit={onSubmitForm}   encType="multipart/form-data" >         
                            
                   
                        <PopupMessage
                            onDismiss={()=>{dismissMessage()}}
                            hidden={message.hidden}
                            positive={message.positive}
                            negative = {message.negative}
                            floating
                            icon={message.icon}
                            header={message.header}
                            content={message.content}
                        />
                    
                        <br/>

                    
                        <Form.Input 
                        disabled
                        label="Image Path"
                        name="imageUrl"
                        onChange={(e) => setImageUrl(e.target.value)}
                        value={imageUrl}
                        width={12}
                        />

                        <Form.Input 
                        required 
                        label="Image"
                        type="file"
                        onChange={onFileChange}
                        filename="blogImage"
                        id="blogImage"
                        width={6}
                        /> 
                        
                        <Button type='submit' color="black">
                            Edit This Posts Picture
                        </Button>
                    </Form>
                </Grid.Column>
            </Grid.Row>         
        </Grid>
        </>
    )
}

export default EditBlogPostPicture;