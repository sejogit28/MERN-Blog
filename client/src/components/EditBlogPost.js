import React, {useState, useContext, useEffect, useRef} from 'react';
import {Grid, Form, Button, Divider} from 'semantic-ui-react';
import Editor from 'react-medium-editor';
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/default.css'

import BlogPostService from '../Services/BlogPostService';
import PopupMessage from './PopupMessage';
import { AuthContext } from '../context/AuthContext';



const EditBlogPostPage = props => 
{   

    const authContext = useContext(AuthContext);



    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [summary, setSummary] = useState("");
    const [body, setBody] = useState("");
    /* const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
        ); */
    const [imageUrl, setImageUrl] = useState("");
    const [readTime, setReadTime] = useState("");
    const [file, setFile] = useState();
    const[date, setDate] = useState(new Date())
    const[tags, setTags] = useState([]);
    
    const tagOptions = ['Exercise', 'Memory', 'Neuroplasticity', 'Sleep', 
                        'Learning', 'Emotion', 'Nutrition'];
        
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

    
    const id = props.match.params.id;

   

    useEffect(() => {
        BlogPostService.getBlogPost(id)
        .then(data=>{
                //You don't need to pass the id here, prob cause you get it from the params
                setTitle(data.title);
                setAuthor(data.author);
                setSummary(data.summary);
                setBody(data.body);
                setImageUrl(data.imageUrl);
                setDate(data.date);
                /*If one of the fields the server is looking for isn't included, the server 
                will return an error. However, with the makeup of this project, that error 
                will be shown in the console as happening at the BlogPostService.
                (date : data.date example)*/
                setTags(data.tags);
                setReadTime(Number(data.readTime));
                console.log(data);
            });
    }, [id]);


    const onCheckBoxChange = e => 
    {
        
        const checkedVal = e.target.name;

        function clearTags(tagsArr, value)
        {
            return tagsArr.filter(function(tag)
            {
                return tag !== value;
            });
        }

        
        if(e.target.checked)
        {
            tags.push(checkedVal)
            setTags(tags);
            console.log(tags)
        }
        else
        {
            let result = clearTags(tags, e.target.name);
            setTags(result);
            console.log(tags);
        }
    };

     const onFileChange = e => 
    {
        setFile(e.target.files[0]);
    }
    
  
    
    
    
    const onSubmitForm = e => 
    {
        e.preventDefault();

        if(body.length < 50)
        /*Need to remeber that when the body is stored in the DB its format 
        changes and this change alters the character count*/
        {

            setMessage({
                icon: "x",
                hidden: false,
                negative: true,
                header: "Error, article not posted",
                content: "Article body must have atleast fifty character"

            })

        }
        else
        {
            const formData = new FormData();
       
            formData.append("title", title);
            formData.append("author", author);
            formData.append("summary", summary);
            formData.append("body", body);
            formData.append("readTime", readTime);
            //formData.append("imageUrl", imageUrl);
            formData.append('blogImage', file);
            tags.forEach(item =>
            {
                formData.append('tags', item);
            });
        

            console.log(...formData);
            
            setMessage(
            {
                icon: "check circle outline",
                hidden: false,
                positive: true,
                header: "Article Posted!!!",          
            })

            timerID = setTimeout(()=>
            {
                dismissMessage();
            }, 4000)

            BlogPostService.editBlogPost(id, formData).then(data =>
            {

                console.log(data);
                props.history.push('/admin');                 
            })
        }
        
        
    }
 

    return(
        <>
                <Grid padded="vertically">
                    <Grid.Row centered>
                        <h1>
                            Edit This Post!!
                        </h1>
                    </Grid.Row>

     
            
            <Divider />

               

            <Grid.Row>
            <Grid.Column>
             <Form onSubmit={onSubmitForm}  encType="multipart/form-data">   
             
                <Form.Input 
                required 
                label="Title"
                placeholder="A few words..."
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                width={9}
                />

                <Form.Input 
                required 
                label="Author"
                placeholder="Your Name!"
                type="text"
                name="author"
                onChange={(e) => setAuthor(e.target.value)}
                value={author}
                width={6}
                />

                <Form.Input 
                required 
                label="Summary"
                placeholder="A sentence or two..."
                type="text"
                name="summary"
                onChange={(e) => setSummary(e.target.value)}
                value={summary}
                />
                
                <br/>
                
                <Editor             
                text={body}
                onChange={(body) => setBody(body)}               
                />

                {/* Needs to be moved to a see-able place */}
                <PopupMessage
                    id="scrollWhenShown"
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

                {/* <Form.TextArea 
                label="Body"
                placeholder="Fail Quickly..."
                type="text"
                name="body"
                onChange={onInputChange}
                value={post.body}
                /> */}

                <Form.Input 
                required 
                label="Image"
                type="file"
                onChange={onFileChange}
                filename="blogImage"
                id="blogImage"
                />

                <Form.Input 
                required 
                label="Read Time"
                type="Number"
                name="readTime"
                onChange={(e) => setReadTime(e.target.value)}
                value={readTime}
                width={2}
                />

                <Form.Input 
                disabled
                label="Date"
                name="date"
                onChange={(e) => setDate(e.target.value)}
                value={date}
                width={2}
                />

                <Form.Input 
                disabled
                label="Image Path"
                name="imageUrl"
                onChange={(e) => setImageUrl(e.target.value)}
                value={imageUrl}
                width={12}
                />

                <Form.Group grouped>
                    <label>Tags</label>
                    {tagOptions.map(tagOp => 
                    {
                        
                        return(
                            
                        tags.includes(tagOp) ?
                        <Form.Field  checked label={`${tagOp}`} name={`${tagOp}`}  value={`${tagOp}`} 
                        /* type='checkbox' */ /* {...tagOptions.includes(tagOp) &&  
                        {className = "checked"}} */ control='input' 
                         type="checkbox" onChange={onCheckBoxChange}/> :
                         
                         <Form.Field  label={`${tagOp}`} name={`${tagOp}`}  value={`${tagOp}`} control='input' 
                         type="checkbox" onChange={onCheckBoxChange}/> 
                         );
                        //for SOME REASON this needs to be a Form.Field and not a Checkbox
                        /*Also, it would appear that props are returned as undefined when 
                        used in a ternary operator. Why?....not sure yet(research came up empty)*/
                    })}
                     <br/>
                </Form.Group>
                
                <Button type='submit' color="black">
                    Edit This Post
                </Button>
                   </Form>
                </Grid.Column>
             </Grid.Row>         
        </Grid>
        </>
    );
}

export default EditBlogPostPage;