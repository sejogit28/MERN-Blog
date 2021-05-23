import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import { Grid, Card, Button } from 'semantic-ui-react';

import BlogPostService from '../Services/BlogPostService';
import BlogAdminCard from './BlogAdminPageCard';


const BlogAdminPage = () =>
{
    const [blogPosts, setBlogPosts] = useState([]);

    useEffect(() =>{
        BlogPostService.getBlogPosts().then(data =>{
            setBlogPosts(data);
        });
    }, []);


    return(
        <Grid container columns='equal'>
            <Grid.Row centered>
                <h1>Admin Page</h1>
            </Grid.Row>
            <Grid.Row>
                <Button fluid color="black"
                ><Link to="/create">Create A New Post</Link>
                    
                </Button>
            </Grid.Row>
            <Grid.Row>
            <Card.Group> 
            {
            blogPosts.reverse().map(blogpost => 
            //.reverse() makes it so the most recently created post is displayed first
                {
                    return(
                        <>
                            
                            <BlogAdminCard  key={blogpost._id} blogpost={blogpost}/>
                        

                        </>
                    )
                })
            }
            </Card.Group>   
            </Grid.Row>
        </ Grid>
     )
        }    

export default BlogAdminPage;