const AuthService = {
  login: async (user) => {
    return await fetch(
      "https://sejomernblogapi.herokuapp.com/entryPoint/login",
      {
        method: "post",
        credentials: "include",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin":
            "https://fervent-darwin-5bcd5e.netlify.app",
        },
      }
    ).then((res) => {
      if (res.status !== 401) return res.json().then((data) => data);
      else return { isAuthenticated: false, user: { username: "", role: "" } };
    });
  },

  googleLogin: async (info) => {
    return await fetch(
      "https://sejomernblogapi.herokuapp.com/entryPoint/googlelogin",
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin":
            "https://fervent-darwin-5bcd5e.netlify.app",
        },
      }
    ).then((res) => {
      if (res.status !== 401) return res.json().then((data) => data);
      else return { isAuthenticated: false, user: { username: "", role: "" } };
    });
  },

  register: async (formData) => {
    return await fetch(
      "https://sejomernblogapi.herokuapp.com/entryPoint/register",
      {
        method: "POST",

        body: formData,
        headers: {
          "Access-Control-Allow-Origin":
            "https://fervent-darwin-5bcd5e.netlify.app",
        },
      }
    ).then((res) => {
      if (res.status !== 401) {
        return res.json().then((data) => data);
      } else return { message: { msgBody: "UnAuthorized " }, msgError: true };
    });
  },

  logout: async () => {
    return await fetch(
      "https://sejomernblogapi.herokuapp.com/entryPoint/logout",
      {
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin":
            "https://fervent-darwin-5bcd5e.netlify.app",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => data);
  },

  isAuthenticated: async () => {
    return await fetch(
      "https://sejomernblogapi.herokuapp.com/entryPoint/authenticated",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Access-Control-Allow-Origin":
            "https://fervent-darwin-5bcd5e.netlify.app",
          "Access-Control-Allow-Credentials": true,
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      if (res.status !== 401) return res.json().then((data) => data);
      else return { isAuthenticated: false, user: { username: "", role: "" } };
    });
  },
};

export default AuthService;
