import {
  localApiUrl,
  localClientUrl,
  remoteApiUrl,
  remoteClientUrl,
} from "./ServiceUtils";
const routeName = "entryPoint";

const AuthService = {
  login: async (user) => {
    return await fetch(`${remoteApiUrl}/${routeName}/login`, {
      method: "post",
      credentials: "include",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": remoteClientUrl,
      },
    }).then((res) => {
      if (res.status !== 401) return res.json().then((data) => data);
      else return { isAuthenticated: false, user: { username: "", role: "" } };
    });
  },

  googleLogin: async (info) => {
    return await fetch(`${remoteApiUrl}/${routeName}/googlelogin`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(info),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": remoteClientUrl,
      },
    }).then((res) => {
      if (res.status !== 401) return res.json().then((data) => data);
      else return { isAuthenticated: false, user: { username: "", role: "" } };
    });
  },

  register: async (formData) => {
    return await fetch(`${remoteApiUrl}/${routeName}/register`, {
      method: "POST",

      body: formData,
      headers: {
        "Access-Control-Allow-Origin": remoteClientUrl,
      },
    }).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },

  logout: async () => {
    return await fetch(`${remoteApiUrl}/${routeName}/logout`, {
      credentials: "include",
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": remoteClientUrl,
      },
    })
      .then((res) => res.json())
      .then((data) => data);
  },

  isAuthenticated: async () => {
    return await fetch(`${remoteApiUrl}/${routeName}/authenticated`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Origin": remoteClientUrl,

        "Access-Control-Allow-Credentials": true,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status !== 401) return res.json().then((data) => data);
      else return { isAuthenticated: false, user: { username: "", role: "" } };
    });
  },
};

export default AuthService;
