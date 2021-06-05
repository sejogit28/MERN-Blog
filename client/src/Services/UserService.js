/*The point of this file is to avoid storing all this info in the component */


export default{
    viewUserList : () =>
    {
        return fetch('/entryPoint/userList')
        .then(response =>{
                if (response.status !== 401)
            {
                return response.json().then(data => data);
            }
            else
                return {message :{msgError: true, msgBody : "Something Went Wrong"}, }
        });
    },
    viewSingleUser : (userId) =>
    {
        return fetch('/entryPoint/singleUser/'+userId)
        .then(res => 
            {
                if(res.status !== 401)
                {
                    return res.json().then(data => data);
                }
                else
                    return {message :{msgBody: "UnAuthorized "}}
            })
    }
}