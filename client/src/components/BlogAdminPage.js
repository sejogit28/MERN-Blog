import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import { Grid, Card, Button } from 'semantic-ui-react';

import BlogPostService from '../Services/BlogPostService';
import BlogAdminCard from './BlogAdminPageCard';


const BlogAdminPage = () =>
{
    const [blogPostsList, setBlogPostsList] = useState([]);

    useEffect(() =>{
        BlogPostService.getBlogPosts().then(data =>{
            setBlogPostsList(data);
        });
    }, []);


    return(
        <Grid container columns='equal'>
            <Grid.Row centered>
                <h1>Admin Page</h1>
            </Grid.Row>
            <Grid.Row>
                <Link  to="/create">
                    <Button fluid color="black">
                        Create A New Post
                </Button>
            </Link>
                
            </Grid.Row>
            <Grid.Row>
            <Card.Group> 
            {
            blogPostsList.reverse().map(blogpost => 
            //.reverse() makes it so the most recently created post is displayed first
                {
                    return(
                        <>
                            
                            <BlogAdminCard
                              key={blogpost._id}
                               blogpost={blogpost}
                               BlogPostService={BlogPostService}
                               blogPostsList={blogPostsList}
                               setBlogPostsList={setBlogPostsList}

                               />
                        

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