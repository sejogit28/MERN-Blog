import React, { useContext} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

const PrivateRoute = ({component : Component, roles, ...rest}) =>
{
    const {isAuthenticated, user} = useContext(AuthContext);
    return(
        <Route {...rest} render={props =>
            {
                if(!isAuthenticated)
                    {return <Redirect to={{pathname: '/login', state: {from : props.location}}}/>}
                if( roles.includes(user.role)) // Means the client is authenticated and they have the correct role to acces the page
                {return <Component {...props}/>}
                else
                { 
                return <Redirect to={{ pathname: '/', 
                                        state : {from : props.location}}}/>
                }
                
            }}/>
    )
}

export default PrivateRoute;