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
    },
    editUserProfilePic : (id, editedUserProfilePicFormData) =>
        {
            return fetch('/entryPoint/updateUserPic/'+id,
            {
              method: "PUT",
              body : editedUserProfilePicFormData,           
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
        editUserBio : (id, editedUserBio) =>
        {
            return fetch('/entryPoint/updateUserBio/'+id,
            {
              method: "PUT",
              body : JSON.stringify(editedUserBio),
              headers: 
              {
                  'Content-Type' : 'application/json'
              }
             
          }).then(res => 
            {
                if(res.status !== 401)
                {
                    return res.json().then(data => data);
                }
                 else
                        return {message :{msgBody: "UnAuthorized "}, msgError : true};
                });  
        }
}