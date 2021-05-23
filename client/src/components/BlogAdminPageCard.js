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
                BlogPostService.deleteBlogPost(props.blogpost._id).then(data => data);
                alert('Post successfully deleted');
                window.location.replace("/admin");
                // https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage
               
            }

        }
        else
        {
            alert('.....nice');
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
                         <Button color="green">
                        <Link to={"posts/"+props.blogpost._id}>View</Link>
                        </Button>
                        <Button.Or />
                        <Button color="yellow">
                        <Link to={"edit/"+props.blogpost._id}>Edit</Link>
                        </Button>
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