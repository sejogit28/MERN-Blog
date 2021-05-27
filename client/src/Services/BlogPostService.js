

export default{
        getBlogPosts : () =>
        {
            return fetch('/blogPost/blogList')
            .then(response =>{
                 if (response.status !== 401)
                {
                    return response.json().then(data => data);
                }
                else
                    return {message :{msgBody : "UnAuthorized"}, }
            });
        }, 

        getBlogPostPagi : (pageNum) => 
        {
            return fetch(`blogPost/blogPagi?page=${pageNum}`)
            .then((res) => res.json())
            
        },

        getBlogPost : (id) =>
        {
            return fetch('/blogPost/'+id)
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

        addBlogPost : (formData) => 
        {
            console.log(formData);
          return fetch('/blogPost/add', 
          {
              method: "POST",
              body : formData,
              
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

        editBlogPost : (id, formData) =>
        {
            return fetch('/blogPost/update/'+id,
            {
              method: "put",
              /*This needed to be specified as a put method, most likely cause thats 
              what it was called in the blogPostRoute */
              body : formData,
             
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
        
        deleteBlogPost : id =>
        {
            return fetch('/blogPost/delete/'+id, 
            {
                method: "delete"
                /*The method needed to be specified here...looks like it defaults to a GET 
                request if you dont specify the method*/
            })
            .then(res => 
                {
                    if(res.status !== 401)
                    {
                        return res.json().then(data => data);
                    }
                    else
                        return {message :{msgBody: "Deletion failed at client"}, msgError: true};
                })
        },

        addComment: (id, newComm) => 
        {
            return fetch('/blogPost/update/'+id+'/addcomm',
            /*It would appear tha that if you don't put the first "/" 
            (/blogPost/update as opposed to blogPost/update)react assumes 
            that you want evrything to the left of theurl that is in the 
            browser window "posts/blogPost" example*/
            {
              method: "put",
              body : JSON.stringify(newComm),
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
        },

        editComment : (id, commId, newCommBody) => 
        {
            return fetch('/blogPost/update/'+id+'/updatecomm/'+commId ,
            {
                method: "put",
                body : JSON.stringify(newCommBody),
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
        },

        deleteComment : (id, commId) =>
        {
            return fetch('/blogPost/update/'+id+'/deletecomm/'+commId,
            {
                method: "put"
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
        }
