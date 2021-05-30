import React from 'react';
import {Link} from 'react-router-dom';
import {Card, Image, Button} from 'semantic-ui-react';

const BlogCard = props =>
{
    return(

          <Card raised fluid={props.fluidTrue} key={props.blogpost._id} >
                {/* The below src had to be in that format to work(couldn't use normal quotes and an "+") */}
                 <Image as={Link} to={"posts/"+props.blogpost._id} style={{'max-height': '200px', 'overflow':'hidden'}} src={`/BlogPostImages/${props.blogpost.imageUrl}`} wrapped ui={true} />
                <Card.Content as={Link} to={"posts/"+props.blogpost._id}>
                    
                        <Card.Header><h1>{props.blogpost.title}</h1></Card.Header>
                   
                    <Card.Meta>
                        <span className='date'>{props.blogpost.createdAt.substring(0,10)}</span>
                    </Card.Meta>

                    <Card.Description as={Link} to={"posts/"+props.blogpost._id}>
                        <h4>
                            {props.blogpost.summary}
                        </h4>
                        <Button as={Link} to={"posts/"+props.blogpost._id} color='black'>Read More</Button>
                    </Card.Description>
                </Card.Content>
                <Card.Content>
                    {props.blogpost.tags.map(tag => 
                        {
                            return(
                                    <Button size='mini' basic color='black'>
                                        {tag}
                                    </Button> 
                                  )
                        }
                        )}
                </Card.Content>
            </Card>
            
        
    )

    }
export default BlogCard;