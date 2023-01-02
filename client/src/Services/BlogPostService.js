import { localApiUrl, remoteApiUrl } from "./ServiceUtils";
const routeName = "blogPost";

const BlogPostService = {
  getBlogPosts: async () => {
    return await fetch(`${remoteApiUrl}/${routeName}/blogList`).then(
      (response) => {
        if (response.status !== 401) {
          return response.json().then((data) => data);
        } else
          return {
            message: { msgError: true, msgBody: "Something Went Wrong" },
          };
      }
    );
  },

  getBlogPostPagi: async (pageNum) => {
    return await fetch(
      `${remoteApiUrl}/${routeName}/blogPagi?page=${pageNum}`
    ).then((response) => {
      if (response.status !== 401) {
        return response.json().then((data) => data);
      } else
        return {
          message: { msgError: true, msgBody: "Something Went Wrong" },
        };
    });
  },

  getBlogPost: async (id) => {
    return await fetch(`${remoteApiUrl}/${routeName}/` + id).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " } };
    });
  },

  addBlogPost: async (formData) => {
    return await fetch(`${remoteApiUrl}/${routeName}/add`, {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },

  editBlogPostNoPic: async (id, editedBlogPost) => {
    return await fetch(`${remoteApiUrl}/${routeName}/updateNoPic/${id}`, {
      method: "put",
      body: JSON.stringify(editedBlogPost),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },

  editBlogPostPic: async (id, editedBlogPostPicFormData) => {
    return await fetch(`${remoteApiUrl}/${routeName}/updatePic/${id}`, {
      method: "PUT",
      body: editedBlogPostPicFormData,
    }).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },

  deleteBlogPost: async (id) => {
    return await fetch(`${remoteApiUrl}/${routeName}/delete/${id}`, {
      method: "delete",
    }).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else
        return {
          message: { msgBody: "Deletion failed at client" },
          msgError: true,
        };
    });
  },

  addComment: async (id, newComm) => {
    return await fetch(`${remoteApiUrl}/${routeName}/update/${id}/addcomm`, {
      method: "put",
      body: JSON.stringify(newComm),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },

  editComment: async (id, commId, newCommBody) => {
    return await fetch(
      `${remoteApiUrl}/${routeName}/update/${id}/updatecomm/${commId}`,
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

  deleteComment: async (id, commId) => {
    return await fetch(
      `${remoteApiUrl}/${routeName}/update/${id}/deletecomm/${commId}`,
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
