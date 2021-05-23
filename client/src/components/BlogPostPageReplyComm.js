import React, {useState, useEffect}from 'react';
import {Button} from 'semantic-ui-react';

import BlogPostSinglePageComment from './BlogPostPageComm'

const BlogPostSinglePageReplyComm = props => 
{
    const[replyCommNumber, setReplyCommNumber] = useState(0);
    const[showReplies, setShowReplies] = useState(true);

    useEffect(() => {
        let commentNum = 0;
        props.postComments.map((comments) => 
        {
            if(comments.parentcommfinder === props.parentCommentId)
            {
                commentNum++;
            }
        })
        setReplyCommNumber(commentNum);
    }, [])
    



   let renderReplyComments = (parentCommId) =>   
        
            props.postComments.map((comm, index) => 
        (
            <>
                {comm.parentcommfinder === parentCommId &&
                <div style={{width: '80%', marginLeft: '40px'}}>
                    <BlogPostSinglePageComment  //aka SingleComment
                        key={comm._id} 
                        comm={comm} 
                        user={props.user} 
                        getBlogPost={props.getBlogPost} 
                        setBlogPost={props.setBlogPost}
                        postComments={props.postComments}
                        postId={props.postId}
                        isAuthenticated={props.isAuthenticated}
                        socket={props.socket}
                        />
                        <BlogPostSinglePageReplyComm //aka ReplyComment
                        key={comm._id} 
                        comm={comm} 
                        postComments={props.postComments}
                        user={props.user} 
                        postId={props.postId} 
                         isAuthenticated={props.isAuthenticated}
                        parentCommentId={comm._id}
                        getBlogPost={props.getBlogPost} 
                        setBlogPost={props.setBlogPost}
                        socket={props.socket}
                        />
                </div>
                }
            </>
            ))
        
                
    const handleShowReplies = () => 
    {
        setShowReplies(!showReplies);
    }
   

        return (
           
            <>
                {
                    !showReplies ? 
                        
                    
                        replyCommNumber > 0 ?
                            <>
                                <Button floated="right" style={{ marginLeft: '40px'}} size="mini" onClick={handleShowReplies}>View {replyCommNumber} more comment(s)</Button> 
                                <br/>
                            </>
                            :
                            null

                    :

                        replyCommNumber > 0 ?
                            <>
                                <br/>
                                <Button style={{ marginLeft: '40px'}} size="mini" onClick={handleShowReplies}>Hide Replies</Button> 
                            </>
                            :
                            null
                        
                }


                {
                    showReplies && 
                    renderReplyComments(props.parentCommentId)
                }
            </>
             );
   
        
        }  
    
    
    

export default BlogPostSinglePageReplyComm;