import { localApiUrl } from "./ServiceUtils";
const routeName = "entryPoint";

const UserService = {
  viewUserList: async () => {
    return await fetch(`${localApiUrl}/${routeName}/userList`).then(
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
  viewSingleUser: async (userId) => {
    return await fetch(`${localApiUrl}/${routeName}/singleUser/` + userId).then(
      (res) => {
        if (res.status !== 401) {
          return res.json().then((data) => data);
        } else return { message: { msgBody: "UnAuthorized " } };
      }
    );
  },
  editUserProfilePic: async (id, editedUserProfilePicFormData) => {
    return await fetch(`${localApiUrl}/${routeName}/updateUserPic/` + id, {
      method: "PUT",
      body: editedUserProfilePicFormData,
    }).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },
  editUserBio: async (id, editedUserBio) => {
    return await fetch(`${localApiUrl}/${routeName}/updateUserBio/` + id, {
      method: "PUT",
      body: JSON.stringify(editedUserBio),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },
};

export default UserService;
