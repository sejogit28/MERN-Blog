import React, {useState, useEffect, useRef}from 'react';
import {Comment, Button, Form} from 'semantic-ui-react';
import moment from 'moment';

import BlogPostService from '../Services/BlogPostService';
import PopupMessage from './PopupMessage';


const BlogPostSinglePageComment = props => 
{
    const[commActionTrigger, setCommActionTrigger] = useState(false);
    const [editCommTrigger, setEditCommTrigger] = useState(false);
    const [editCommValue, setEditCommValue] = useState({commBody: props.comm.commBody});
    let timerID = useRef(null);

    const [replyCommTrigger, setReplyCommTrigger] = useState(false);
    const [replyCommValue, setReplyCommValue] = useState(
        {
            username: props.user.username,
            commBody: "", 
            parentcommfinder: props.comm._id,
            postfinder: props.postId,
            posterImageUrl: props.user.userImageUrl
        })

    const [commMessage, setCommMessage] = useState(
        {
            icon: "",
            hidden: true,
            positive: false,
            negative: false,
            header: "",
            content: ""
        });

  useEffect(() => 
    {
        if(props.socket)
        {
            props.socket.on('sendCommentToClient', msg =>
            {
                props.setBlogPost(msg);
            })
            return () => props.socket.off('sendCommentToClient')
        }
        
    }, [props.socket, props.blogPost])
    const editCommTriggerFunc = () => 
    {
        setEditCommTrigger(!editCommTrigger);           
    }
 
    const onEditCommInputChange = e => 
    {
        setEditCommValue({...editCommValue, [e.target.name] : e.target.value});
    }

    const editCommentSubmit = (id, commid) => 
    {    
        
       console.log(editCommValue, id, commid );
        //setEditCommTrigger(!editCommTrigger);

        const oneCharNoWhiteSpaceRegex = /([a-zA-Z])+([ -~])*/;

        if(editCommValue.commBody === "" || oneCharNoWhiteSpaceRegex.test(editCommValue.commBody) === false)
        {
            setCommMessage({
                icon: "x",
                hidden: false,
                negative: true,
                header: "Error, comment not posted",
                content: "Comment body must have atleast one character"

            })
            
        }
        else
        {
            setCommMessage({
                icon: "check circle outline",
                hidden: false,
                positive: true,
                header: "Comment Edited!",          
            })

            timerID = setTimeout(()=>
            {
                dismissReplyCommMessage();
            }, 4000)

            
            BlogPostService.editComment(id, commid, editCommValue)
            .then(data => {
            
                console.log(data)
                BlogPostService.getBlogPost(id)
                .then(editedData => 
                {
                    
                    props.setBlogPost(editedData);
                    /*Putting the line below in the api call gave the UI time to render the 
                    success messae before the edit Comm Form was closed*/
                    setEditCommTrigger(false);
                    commActionTriggerFunc();
                })
            
            })
        
        setEditCommValue(editCommValue);
        }
        
        
    }
    const commActionTriggerFunc = () => 
    {
        if(props.isAuthenticated)
        {
            setCommActionTrigger(!commActionTrigger);
            if(replyCommTrigger)
            {
                setReplyCommTrigger(false);
            }
            if(editCommTrigger)
            {
                setEditCommTrigger(false);
            }
        }
        else
        {
            alert("Please log in or sign up");
        }
    }

    const replyCommTrigerFunc = () => 
    {
        if(props.isAuthenticated)
        {
            setReplyCommTrigger(!replyCommTrigger);
        }
        else
        {
            alert("Please log in");
        }
    }

    const onReplyComChange = e => 
    {
        setReplyCommValue({...replyCommValue, [e.target.name] : e.target.value});
    }

    /* const replyCommSubmit = e => 
    { 
        console.log(replyCommValue);
        BlogPostService.addComment(props.postId, replyCommValue)
        .then(data => 
            {
                console.log(data);    
                BlogPostService.getBlogPost(props.postId)
                .then(posteddata => 
                {
                    props.setBlogPost(posteddata);  
                });
                
            });
        
           setReplyCommValue("");
           /*This WAS needed to reset the form since you're WERENT using useState for the 
           onChange BEFORE. Now it's just a less verbose way of resetting the comm form
            
    } */

    const dismissReplyCommMessage = () => 
    {
        setCommMessage(
        {
            icon: "",
            hidden: true,
            positive: false,
            negative: false,
            header: "",
            content: ""
        })
    }

    const onCommSubmit = e => 
    {
        
        e.preventDefault();
        
        //comm.commBody = commBodyRef.current.value;
        
        console.log(replyCommValue);
        const {commBody, postfinder, username, parentcommfinder,posterImageUrl} = replyCommValue;
        const oneCharNoWhiteSpaceRegex = /([a-zA-Z])+([ -~])*/;

        if (commBody === "" || oneCharNoWhiteSpaceRegex.test(editCommValue.commBody) === false)
        {
            setCommMessage({
                icon: "x",
                hidden: false,
                negative: true,
                header: "Error, comment not posted",
                content: "Comment body must have atleast one character"

            })
            e.target.reset(); 
        }
        else
        {
            props.socket.emit('createComment', 
            {
                commBody, postfinder, username, parentcommfinder, posterImageUrl
            })

            setCommMessage({
                icon: "check circle outline",
                hidden: false,
                positive: true,
                header: "Reply Comment Posted",          
            })

            timerID = setTimeout(()=>
            {
                dismissReplyCommMessage();
            }, 4000)

            setReplyCommValue(
            {
                username : props.user.username,
                commBody : "",
                postfinder: props.postId,
                posterImageUrl: props.user.userImageUrl
            });
        }
        
        
           e.target.reset(); 
           
    }

    

   const deleteComment = (postId, commId, commUsername) => 
   {
       if(window.confirm("Really delete your comment?")=== true)
       {
          var commUsernameInput = prompt('Please type your username to confirm...');
           if(commUsernameInput === commUsername)
           {        
                BlogPostService.deleteComment(postId, commId)
                .then(async data => 
                        {
                            console.log(data);    
                            await BlogPostService.getBlogPost(postId)
                            .then(async deleteddata => {
                            await props.setBlogPost(deleteddata);
                            
                        });
                            
                        });
                console.log('Comment Delete Test!!');
            }
            else
            {
                window.alert("Incorrect username entered, deletion cancelled");
            }
        }
        else
        {
            window.alert("Deletion cancelled")
        }
   }
    
    return(
        <Comment key={props.comm._id}>
                     <Comment.Avatar  src={`/UserImages/${props.comm.posterImageUrl}`}/>                             
                        <Comment.Content>
                            <Comment.Author>
                                <h1>{props.comm.username}</h1>
                            </Comment.Author>
                            <Comment.Metadata>
                              <span>Posted {moment(props.comm.createdAt).fromNow()}</span>
                            </Comment.Metadata>
                            <Comment.Text>
                                <p>{props.comm.commBody}</p>
                            </Comment.Text>
                            {!commActionTrigger? 
                                <Button onClick={commActionTriggerFunc} key={props.comm._id} basic color="black" content="Actions" icon="plus circle"/> 
                                :
                            
                            <Comment.Actions>
                                
                                <Button  onClick={replyCommTrigerFunc} key={props.comm._id} color="black" content="Reply" icon="reply"/>
                                {
                                    props.comm.username === props.user.username ?
                                        <>
                                            <Button onClick={editCommTriggerFunc} key={props.comm._id} content="Edit" icon="edit"/> 
                                            {/* Passing the key to this function specified that it will be the only one that opens when you press the edit button */}
                                            <Button onClick={() => deleteComment( props.comm.postfinder, props.comm._id, props.comm.username)} key={props.comm._id}  color="gray" content="Delete" icon="trash"/>
                                        </>
                                    : null  
                                }
                                <Button onClick={commActionTriggerFunc} content="Cancel" icon='cancel'/>

                            </Comment.Actions>
                            }
                        </Comment.Content>
                       
                                {
                                    editCommTrigger &&
                                    <>
                                        <Form  onSubmit={() => editCommentSubmit(props.comm.postfinder, props.comm._id)}>
                                            <Form.TextArea 
                                            placeholder="Input your updated comment!!"
                                            type="text"
                                            name="commBody" 
                                            value={editCommValue.commBody} 
                                            onChange={onEditCommInputChange}    
                                            />
                                            <Button fluid primary type='submit'>
                                                Edit your Comment
                                            </Button>
                                        </Form> 
                                        <PopupMessage
                                            onDismiss={()=>{dismissReplyCommMessage()}}
                                            hidden={commMessage.hidden}
                                            positive={commMessage.positive}
                                            negative = {commMessage.negative}
                                            floating
                                            icon={commMessage.icon}
                                            header={commMessage.header}
                                            content={commMessage.content}
                                        />
                                    </>
                                } 

                                {
                                    replyCommTrigger &&
                                    <>
                                        <Form onSubmit={onCommSubmit}>
                                            <Form.TextArea 
                                            placeholder="Type your reply"
                                            type="text"
                                            name="commBody" 
                                            onChange={onReplyComChange}    
                                            />
                                            <Button fluid primary type='submit'>
                                                Reply to Comment
                                            </Button>
                                        </Form> 
                                        <PopupMessage
                                            onDismiss={()=>{dismissReplyCommMessage()}}
                                            hidden={commMessage.hidden}
                                            positive={commMessage.positive}
                                            negative = {commMessage.negative}
                                            floating
                                            icon={commMessage.icon}
                                            header={commMessage.header}
                                            content={commMessage.content}
                                        />
                                    </>
                                }  


                        </Comment>
    );
}

export default BlogPostSinglePageComment;