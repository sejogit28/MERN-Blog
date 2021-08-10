import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Card} from 'semantic-ui-react';

import BlogPostService from '../Services/BlogPostService';

const BlogAdminCard = props =>
{
  
    const deleteBlogPostFunc = () =>
    {
        
        if( window.confirm("Really Delete this post?") === true)
        {
            var currPostTitle = prompt('Please type the title of the post that you want to delete');
            if(currPostTitle === props.blogpost.title)
            {
                props.BlogPostService.deleteBlogPost(props.blogpost._id)
                .then(data => 
                {
                    props.BlogPostService.getBlogPosts().then(data =>
                    {
                        props.setBlogPostsList(data);
                    });
                });
                alert('Post successfully deleted');

                /* window.location.replace("/admin");
                // https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage
                */
            }

        }
        else
        {
            alert('Post deletion cancelled');
        }        
    }
    
    return(
          <Card fluid>
                <Card.Content>
                    <Link to={"posts/"+props.blogpost._id}>
                        <Card.Header>
                            <h1>
                                {props.blogpost.title}
                            </h1>
                        </Card.Header>
                    </Link>
                    <Card.Meta>
                        <span className='date'>{props.blogpost.createdAt.substring(0,10)}</span>
                    </Card.Meta>

                    <Card.Description>
                        <Link to={"posts/"+props.blogpost._id}>
                            <p>
                                {props.blogpost.summary}
                            </p>
                        </Link>
                    </Card.Description>
                </Card.Content>
                <Card.Content>
                    <Button.Group>
                         
                        <Link to={"posts/"+props.blogpost._id}>
                            <Button color="green">
                                View
                            </Button>
                        </Link>
                        

                        <Button.Or />

                        
                        <Link to={"edit/"+props.blogpost._id}>
                            <Button color="yellow">
                                Edit
                            </Button>
                        </Link>
                        
                        <Button.Or />

                        
                        <Link to={"editPic/"+props.blogpost._id}>
                            <Button color="yellow">
                                Change Pic
                            </Button>
                        </Link>
                        

                        <Button.Or />

                        <Button color="red" onClick={deleteBlogPostFunc}>
                        Delete 
                        </Button>
                    </Button.Group>
                </Card.Content>
            </Card>
            
        
    )

    }
export default BlogAdminCard;