/*The point of this file is to avoid storing all this info in the component */
//let BlogUsers = require('../../../backend/blogModels/users.model');

export default{
    login : user =>
    {

        console.log(user);
        return fetch('/entryPoint/login', 
        {
            method: "post",
            body: JSON.stringify(user),
            headers: 
            {
                'Content-Type' : 'application/json'
            }
        }).then(res => { 
            if(res.status !== 401)
                    return res.json().then(data => data);
            else
                return { isAuthenticated: false, user: {username: "", role: ""}};            
            })
    },

    googleLogin: info =>
    {
        console.log(info);
        return fetch('/entryPoint/googlelogin', 
        {
            method: "POST",
            body: JSON.stringify(info),
            headers: 
            {
                'Content-Type' : 'application/json'
            }
        }).then(res => 
            {
                if (res.status !== 401)
                    return res.json().then(data=> data);
                else    
                    return {isAuthenticated: false, user: {username: "", role: ""}}
            })
    },

    register: formData =>
    {
        return fetch('/entryPoint/register', 
        {
            method: "POST",
            body: formData,
        }).then(res => 
            {
                if(res.status !== 401)
                {
                    return res.json().then(data => data);
                }
                 else
                        return {message :{msgBody: "UnAuthorized "}, msgError : true};
                }); 
    },

    logout: () =>
    {
        return fetch('/entryPoint/logout')
        .then(res=> res.json())
        .then(data => data);
    },

    isAuthenticated : () =>
    {
        return fetch('/entryPoint/authenticated',
        {
            method: "GET",
            headers: 
            {
                "Access-Control-Allow-Origin": "*",
                'Content-Type' : 'application/json'
            }
        })
        .then(res=>
            {   
                if(res.status !== 401)
                    return res.json().then(data => data);
                
                else
                    return { isAuthenticated: false, user: {username: "", role: ""}};
                
            });
    }
}