import React, {useEffect, useState, useContext}from 'react';
import { Grid, Segment, Header, Comment, Icon, Form, Button, Divider} from 'semantic-ui-react';
import {Link} from 'react-router-dom'
import io from 'socket.io-client';
//import { convertFromRaw} from 'draft-js';
//import {stateToHTML} from 'draft-js-export-html';

import {AuthContext} from '../context/AuthContext';
import BlogPostService from '../Services/BlogPostService';
import BlogPostSinglePageComment from './BlogPostPageComm';
import BlogPostSinglePageReplyComm from './BlogPostPageReplyComm';



const BlogPostSinglePage = props => 
{


    const{isAuthenticated, user} = useContext(AuthContext);
    const[socket, setSocket] = useState(null);

    const [blogPost, setBlogPost] = useState(
        {
        createdAt:"",
        comments : []  
        });
        /*The comments array and createdAt var are intialized to avoid an error since
        the data isn't loaded fastenough(asynchronically) */
    
    const [commValue, setCommValue] = useState(
        {
            username : user.username,
            commBody : "",
            postfinder: props.match.params.id,
            posterImageUrl: user.userImageUrl
        });
     

    useEffect(() => 
    {      
        /* const currUrlString = window.location.href.toString();
        const currUrlStringIndex = currUrlString.lastIndexOf('/');
        const currblogPostId = currUrlString.substring(currUrlStringIndex + 1);

        This was a MUCH MORE complicated way to get the Id from the url...the
        line below shows the better way(Must pass props as an argument for this
        better way to work)*/
            
        BlogPostService.getBlogPost(props.match.params.id)
        .then(postdata => {
                    setBlogPost(postdata);                  
                    console.log(postdata);
                   
            })   
        
        const socket = io() 
        /* in this video: https://youtu.be/tBKUxOdK5Q8?t=2633 a global state was used to 
        set up the socket. However, this seems to have worked without using a global state*/
        setSocket(socket)
        return () => socket.close()
        
    }, [props.match.params.id]);
    //const commFormRef = createRef(); This doesn't appear neccesary for now...
    
    const postId = props.match.params.id;

    useEffect(() =>
    {
        if(socket)
        {
            socket.emit('joinRoom', postId)
        }
    }, [socket, postId])


    useEffect(() => 
    {
        if(socket)
        {
            socket.on('sendCommentToClient', msg =>
            {
                setBlogPost({...msg});
            })
            return () => socket.off('sendCommentToClient')
        }
        
    }, [socket, blogPost])

    const LoggedInCommMessage = () => 
    {
       return(
        <Segment textAlign="center"> 
            
            <h2>
                What Do You Think? <Icon name="comments outline" size="large"/>
            </h2>
        </Segment> 
       )
    }

   const LoggedOutCommMessage = () => 
   {
       return(
        <Segment textAlign="center"> 
            <Icon name="comments outline" size="huge"/>
            <h2>
                <Link to="/login"> Log-In </Link> 
                    --OR--
                <Link to="/register"> Sign-Up </Link> 
                    To Join The Discussion.
            </h2>
        </Segment>
       )
    }
    
    //const commBodyRef = useRef("");
     

    //commList.current.comments = blogPost.comments;
    //const solidCommList = commList.current.focus();
  
    //const comm = { username: user.username, commBody: "" }
    
    const onCommBodyChange = e => 
    {
        setCommValue({...commValue, [e.target.name] : e.target.value});
       
       
        //commBodyRef.current = e.target;
        /*This allows the useRef container to get the value that's inputted
        **Theory** It would appear that putting "value" after commBodyRef.current 
        only allows you to see the current value but doesn't allow you to change 
        it*/
    }

    const onCommSubmit = e => 
    {
        
        e.preventDefault();
        
        //comm.commBody = commBodyRef.current.value;
        
        console.log(commValue);
        const {commBody, postfinder, username, parentcommfinder, posterImageUrl} = commValue;

        socket.emit('createComment', 
        {
            commBody, postfinder, username, parentcommfinder, posterImageUrl
        })


       /*  BlogPostService.addComment(props.match.params.id, commValue)
        .then(data => 
            {
                console.log(data);    
                BlogPostService.getBlogPost(props.match.params.id)
                .then(posteddata => {
                setBlogPost(posteddata);
                /*This nested api call was needed for the re-render to work
                (for the new comment to show up after it's been submitted.)
                This most likely has to do with the async nature of these calls,
                **Theory** nesting these makes the calls more immediate as opposed
                to having them be one after another
                
                This was 'deprecated' once you made the comments real-time and had to send
                the form info by socket, to the socket in the server and back
             });
                
            }); */
        
           e.target.reset(); 
           /*This WAS needed to reset the form since you're WERENT using useState for the 
           onChange BEFORE. Now it's just a less verbose way of resetting the comm form*/
            
    }

 


  

/*   
const cssTrick = idValue => 
{
    return "commSel"+idValue;
} */


    return(
    <>
        {
            blogPost &&
                <Grid centered >
                    <Grid.Column width={8} >
                        <h1>{blogPost.title}</h1>
                        <h4>{blogPost.summary}</h4> <br/>
                         <h5>Written by: {blogPost.author} on {blogPost.createdAt && blogPost.createdAt.substring(0,10)}</h5>
                         {blogPost.body && <div dangerouslySetInnerHTML={{__html : blogPost.body}}></div>}
                    </Grid.Column>
                </Grid>                                  
        }

    <Comment.Group>
            <Header as='h2' dividing>
                Comments
            </Header>
         
        {!isAuthenticated ? LoggedOutCommMessage() : LoggedInCommMessage() }

         
        {isAuthenticated?
          <Form  onSubmit={onCommSubmit}>
                <Form.TextArea 
                    placeholder="Post A Comment!!"
                    type="text"
                    name="commBody"     
                    onChange={onCommBodyChange}   
                />
                <Button fluid color="black" type='submit'>
                    Post a Comment
                </Button>
            </Form> : null
        }
            
            {
                blogPost.comments &&
            blogPost.comments.slice().reverse().map((comm) =>
               (! comm.parentcommfinder &&
                  /*IMPORTANT, in order for this to work the props MUST be passed down correctly
                    https://github.com/jaewonhimnae/react-youtube-clone/blob/master/client/src/components/views/DetailVideoPage/DetailVideoPage.js
                    https://github.com/jaewonhimnae/react-youtube-clone/blob/master/client/src/components/views/DetailVideoPage/Sections/Comments.js
                    https://github.com/jaewonhimnae/react-youtube-clone/blob/master/client/src/components/views/DetailVideoPage/Sections/ReplyComment.js*/  
                   <>
                     <BlogPostSinglePageComment  //aka SingleComment
                     key={comm._id} 
                     comm={comm} 
                     user={user} 
                     getBlogPost={BlogPostService.getBlogPost} 
                     setBlogPost={setBlogPost}
                     postComments={blogPost.comments}
                     postId={comm.postfinder}
                     parentCommentId={comm._id}
                     isAuthenticated={isAuthenticated}
                     onCommSubmit={onCommSubmit}
                     socket={socket}
                     />
                     <BlogPostSinglePageReplyComm //aka ReplyComment
                     
                     postComments={blogPost.comments}
                     comm={comm}
                     user={user} 
                     postId={comm.postfinder}
                     isAuthenticated={isAuthenticated}
                     parentCommentId={comm._id}
                     getBlogPost={BlogPostService.getBlogPost} 
                     setBlogPost={setBlogPost}
                     onCommSubmit={onCommSubmit}
                     socket={socket}
                     />
                     {/* <br></br> */}
                     <Divider/>
                    </>
                    
                   
                
                )
            )
            }
        
    </Comment.Group>
   </>
);
}

export default BlogPostSinglePage;
