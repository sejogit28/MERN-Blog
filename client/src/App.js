import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import BlogNavBar from "./components/BlogNavBar";
import BlogFooter from "./components/BlogFooter";
import Login from "./components/Login";
import Register from "./components/Register";
import BlogMainPage from "./components/BlogMainPage";
import BlogSearchPage from "./components/BlogSearchPage";
import BlogPostSinglePage from "./components/BlogPostPage";
import EditBlogPostPage from "./components/EditBlogPost";
import EditBlogPostPicture from "./components/EditBlogPostPicture";
import UserProfilePage from "./components/UserProfilePage";
import BlogAdminPage from "./components/BlogAdminPage";
import CreateBlogPostPage from "./components/CreateBlogPost";
import PrivateRoute from "./hocs/PrivateRoute";
import UnPrivateRoute from "./hocs/UnPrivateRoute";

import "semantic-ui-css/semantic.min.css";

//TODO: Re-architecture
//TODO: Fix nested api calls(use the effect)
function App() {
  /*Adding "blogPost"(posts) before the path for the BlogPostSinglePage helped
  JS not confuse the BlogPostSinglePage and the admin page*/
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
