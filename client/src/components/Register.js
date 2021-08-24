import React, {useState, useRef, useEffect, useContext} from 'react';
import AuthServices from '../Services/AuthServices';
import Message from '../components/Message';
import {Grid, Form, Button, Divider} from 'semantic-ui-react';
import GoogleLogin from 'react-google-login';
import {AuthContext} from '../context/AuthContext';


const Register = props =>
{
    //const[user, setUser] = useState({username: "", password: "", email: "", role: "user"});
    const[username, setUsername] = useState("")
    const[password, setPassword] = useState("");
    const[email, setEmail] = useState("");
    const[bio, setBio] = useState("");
    const [file, setFile] = useState("");

    const[message, setMessage] = useState(null);
    const authContext = useContext(AuthContext);
    let timerID = useRef(null);

    useEffect(()=>
    {
        return()=>
        {
            clearTimeout(timerID); 
        }
    },[]);



/* const onInputChange = e => 
{
    setUser({...user, [e.target.name] : e.target.value});
    
} */

    const successfulGoogle = (response) => 
    {
        console.log(response);
        AuthServices.googleLogin(response).then(data=> {
        
        const{isAuthenticated, user, message} = data;
        setMessage(message);
        if(!message.msgError)
        {
            
            authContext.setUser(user);
            authContext.setIsAuthenticated(isAuthenticated);
            props.history.push('/');
            
         
        }

    })
    
    }

    const unSuccessfulGoogle = (response) =>
    {
        console.log(response);
    }

    const onFileChange = e => 
    {
        setFile(e.target.files[0]);
    }

    const resetForm = ()=> 
    {
        setUsername('');
        setEmail('');
        setBio('');
        setPassword('');
    }

    const onSubmitForm = e => 
    {
        e.preventDefault();

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("email", email);
        formData.append("bio",  bio);
        formData.append('role', 'user');
        formData.append('userImage', file);

        for (var value of formData.values()) 
        {
            console.log(value);
        }
        AuthServices.register(formData).then(data=> {
        const {message} = data;
        setMessage(message);
        resetForm();
        if(!message.msgError)
        {
            timerID = setTimeout(()=>
            {
                props.history.push('/login');
            }, 2000)
        }     
        }).catch(err =>
        {
            console.log(err);
        });
    }


    return(
    <Grid centered padded="vertically">
        <Form onSubmit={onSubmitForm} encType="multipart/form-data">
    
            <Grid.Row>
                <h1>
                    Register
                </h1>
            </Grid.Row>  

            <Divider />

            <Grid.Row>
                
            <GoogleLogin
            clientId="909343250416-nj79c4cachka2hbd0dptdl6rp36feql3.apps.googleusercontent.com"
            buttonText="Sign Up/In with your Google profile!"
            onSuccess={successfulGoogle}
            onFailure={unSuccessfulGoogle}
            cookiePolicy={'single_host_origin'}
            />

            </Grid.Row>

            <br/>

            <Grid.Row>
                <h2>- OR -</h2>
            </Grid.Row>
            <br/> 
            <Grid.Row>  
                <Form.Input
                required 
                label="User Name"
                placeholder="Your username..."
                type="text"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                />

                <Form.Input 
                required
                label="Password"
                placeholder="Your password..."
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                />

                 <Form.Input 
                required
                label="Email"
                placeholder="Your email..."
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                />

                <Form.TextArea 
                label="Bio"
                placeholder="A few sentences about yourself"
                type="text"
                name="bio"
                onChange={(e) => setBio(e.target.value)}
                />

                <Form.Input 
                required 
                label="Profile Picture"
                type="file"
                onChange={onFileChange}
                filename="userImage"
                id="userImage"
                />

                <Button color='black' type='submit'>
                    Register
                </Button>

            </Grid.Row>  
        </Form>
        <Grid.Row>
            {message ? <Message message={message}/> : null }
        </Grid.Row>
        </Grid>
    )
}

export default Register;
