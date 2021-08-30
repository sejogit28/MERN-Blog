import React, {useState, useContext} from 'react';
import AuthServices from '../Services/AuthServices';
import Message from '../components/Message';
import {Grid, Form, Button, Divider} from 'semantic-ui-react';
import GoogleLogin from 'react-google-login';
import {AuthContext} from '../context/AuthContext';


const Login = props =>
{
    const[user, setUser] = useState({username: "", password: ""});
    const[message, setMessage] = useState(null);
    const authContext = useContext(AuthContext);

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

const onInputChange = e => 
{
    setUser({...user, [e.target.name] : e.target.value});
}

const onDemoUserLogin = () =>
{
        user.username = "Demo User";
        user.password = "D8f8nd@DU";
        AuthServices.login(user).then(data=> {
        console.log(data);
        const{isAuthenticated, user, message} = data;
        if(isAuthenticated)
        {
            authContext.setUser(user);
            authContext.setIsAuthenticated(isAuthenticated);
            props.history.push('/');         
        }
        else
        {
            setMessage(message);
        }
    });

}
const onSubmitForm = e => 
{
    e.preventDefault();
    AuthServices.login(user).then(data=> {
        console.log(data);
        const{isAuthenticated, user, message} = data;
        if(isAuthenticated)
        {
            authContext.setUser(user);
            authContext.setIsAuthenticated(isAuthenticated);
            props.history.push('/');         
        }
        else
        {
            setMessage(message);
        }
    });
}

    return(
    <Grid centered padded="vertically">
        <Form onSubmit={onSubmitForm}>
    
            <Grid.Row>
                <h1>
                    Log-in
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
                onChange={onInputChange}
                />

                <Form.Input 
                required
                label="Password"
                placeholder="Your password..."
                type="password"
                name="password"
                onChange={onInputChange}
                />

                <Button color='black' type='submit'>
                    Log-In!
                </Button>

            </Grid.Row>  
        </Form>
        <Grid.Row>
            {message ? <Message message={message}/> : null }
        </Grid.Row>

        <br/>

            <Grid.Row>
                <h2>- OR -</h2>
            </Grid.Row>
            <br/> 

            <Button color='black' onClick={onDemoUserLogin}>
                1-Click Log-In as a Demo User!
            </Button>

        </Grid>
    )
}

export default Login;