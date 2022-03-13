const BlogPostService = {
  getBlogPosts: () => {
    return fetch(
      "https://sejomernblogapi.herokuapp.com/blogPost/blogList"
    ).then((response) => {
      if (response.status !== 401) {
        return response.json().then((data) => data);
      } else
        return { message: { msgError: true, msgBody: "Something Went Wrong" } };
    });
  },

  getBlogPostPagi: (pageNum) => {
    return fetch(
      `https://sejomernblogapi.herokuapp.com/blogPost/blogPagi?page=${pageNum}`
    ).then((res) => res.json());
  },

  getBlogPost: (id) => {
    return fetch("https://sejomernblogapi.herokuapp.com/blogPost/" + id).then(
      (res) => {
        if (res.status !== 401) {
          return res.json().then((data) => data);
        } else return { message: { msgBody: "UnAuthorized " } };
      }
    );
  },

  addBlogPost: (formData) => {
    console.log(formData);
    return fetch("https://sejomernblogapi.herokuapp.com/blogPost/add", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },

  editBlogPostNoPic: (id, editedBlogPost) => {
    return fetch(
      "https://sejomernblogapi.herokuapp.com/blogPost/updateNoPic/" + id,
      {
        method: "put",
        body: JSON.stringify(editedBlogPost),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },

  editBlogPostPic: (id, editedBlogPostPicFormData) => {
    return fetch(
      "https://sejomernblogapi.herokuapp.com/blogPost/updatePic/" + id,
      {
        method: "PUT",
        body: editedBlogPostPicFormData,
      }
    ).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },

  deleteBlogPost: (id) => {
    return fetch(
      "https://sejomernblogapi.herokuapp.com/blogPost/delete/" + id,
      {
        method: "delete",
      }
    ).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else
        return {
          message: { msgBody: "Deletion failed at client" },
          msgError: true,
        };
    });
  },

  addComment: (id, newComm) => {
    return fetch(
      "https://sejomernblogapi.herokuapp.com/blogPost/update/" +
        id +
        "/addcomm",
      /*It would appear tha that if you don't put the first "/" 
            (/blogPost/update as opposed to blogPost/update)react assumes 
            that you want everything to the left of the url that is in the 
            browser window "posts/blogPost" example*/
      {
        method: "put",
        body: JSON.stringify(newComm),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },

  editComment: (id, commId, newCommBody) => {
    return fetch(
      "https://sejomernblogapi.herokuapp.com/blogPost/update/" +
        id +
        "/updatecomm/" +
        commId,
      {
        method: "put",
        body: JSON.stringify(newCommBody),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },

  deleteComment: (id, commId) => {
    return fetch(
      "https://sejomernblogapi.herokuapp.com/blogPost/update/" +
        id +
        "/deletecomm/" +
        commId,
      {
        method: "put",
      }
    ).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },
};

export default BlogPostService;
