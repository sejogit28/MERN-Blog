import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import BlogNavBar from "./pages/uiShell/BlogNavBar";
import BlogFooter from "./pages/uiShell/BlogFooter";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import BlogMainPage from "./pages/blogMainPage/BlogMainPage";
import BlogSearchPage from "./pages/blogSearchPage/BlogSearchPage";
import BlogPostSinglePage from "./pages/blogPostPage/BlogPostPage";
import EditBlogPostPage from "./pages/blogEditPage/EditBlogPost";
import EditBlogPostPicture from "./pages/blogEditPage/EditBlogPostPicture";
import UserProfilePage from "./pages/userProfilePage/UserProfilePage";
import BlogAdminPage from "./pages/blogAdminPage/BlogAdminPage";
import CreateBlogPostPage from "./pages/blogCreatePage/CreateBlogPost";
import PrivateRoute from "./hocs/PrivateRoute";
import UnPrivateRoute from "./hocs/UnPrivateRoute";

import "semantic-ui-css/semantic.min.css";

function App() {
  return (
    <Router>
      <BlogNavBar />
      <Container style={{ marginTop: "30px", marginBottom: "170px" }}>
        <Route exact path="/" component={BlogMainPage} />
        <Route exact path="/Search" component={BlogSearchPage} />
        <Route exact path="/posts/:id" component={BlogPostSinglePage} />
        <PrivateRoute
          path="/create"
          roles={["admin"]}
          component={CreateBlogPostPage}
        />
        <PrivateRoute
          path="/edit/:id"
          roles={["admin"]}
          component={EditBlogPostPage}
        />
        <PrivateRoute
          path="/editPic/:id"
          roles={["admin"]}
          component={EditBlogPostPicture}
        />
        <PrivateRoute
          path="/admin"
          roles={["admin"]}
          component={BlogAdminPage}
        />
        <PrivateRoute
          path="/userProfile/:id"
          roles={["user", "admin"]}
          component={UserProfilePage}
        />
        <UnPrivateRoute path="/login" component={Login} />
        <UnPrivateRoute path="/register" component={Register} />
      </Container>
      <BlogFooter />
    </Router>
  );
}
/*"exact" definition(s): 
https://stackoverflow.com/questions/49162311/react-difference-between-route-exact-path-and-route-path
https://reactrouter.com/web/api/Route/exact-bool
*/
export default App;
