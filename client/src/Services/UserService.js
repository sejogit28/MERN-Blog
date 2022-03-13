const UserService = {
  viewUserList: () => {
    return fetch(
      "https://sejomernblogapi.herokuapp.com/entryPoint/userList"
    ).then((response) => {
      if (response.status !== 401) {
        return response.json().then((data) => data);
      } else
        return { message: { msgError: true, msgBody: "Something Went Wrong" } };
    });
  },
  viewSingleUser: (userId) => {
    return fetch(
      "https://sejomernblogapi.herokuapp.com/entryPoint/singleUser/" + userId
    ).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " } };
    });
  },
  editUserProfilePic: (id, editedUserProfilePicFormData) => {
    return fetch(
      "https://sejomernblogapi.herokuapp.com/entryPoint/updateUserPic/" + id,
      {
        method: "PUT",
        body: editedUserProfilePicFormData,
      }
    ).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },
  editUserBio: (id, editedUserBio) => {
    return fetch(
      "https://sejomernblogapi.herokuapp.com/entryPoint/updateUserBio/" + id,
      {
        method: "PUT",
        body: JSON.stringify(editedUserBio),
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
};

export default UserService;
