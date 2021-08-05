import React, {useState, useContext} from 'react';
import AuthServices from '../Services/AuthServices';
import Message from '../components/Message';
import {Grid, Form, Button, Divider} from 'semantic-ui-react';
import {AuthContext} from '../context/AuthContext';


const Login = props =>
{
    const[user, setUser] = useState({username: "", password: ""});
    const[message, setMessage] = useState(null);
    const authContext = useContext(AuthContext);

const onInputChange = e => 
{
    setUser({...user, [e.target.name] : e.target.value});
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
        </Grid>
    )
}

export default Login;