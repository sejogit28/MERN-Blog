import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';  
import {Container} from 'semantic-ui-react'; 

import BlogNavBar from './components/BlogNavBar';
import Login from './components/Login';
import Register from './components/Register';
import BlogMainPage from './components/BlogMainPage';
import BlogSearchPage from './components/BlogSearchPage';
import BlogPostSinglePage from './components/BlogPostPage';
import BlogAdminPage from './components/BlogAdminPage';
import CreateBlogPostPage from './components/CreateBlogPost';
import PrivateRoute from './hocs/PrivateRoute';
import UnPrivateRoute from './hocs/UnPrivateRoute';

import 'semantic-ui-css/semantic.min.css';
import EditBlogPostPage from './components/EditBlogPost';

function App() {
  /*Adding "blogPost"(posts) before the path for the BlogPostSinglePage helped
  JS not confuse the BlogPostSinglePage and the admin page*/
  return (
    
    <Router>
         <BlogNavBar />
         <Container>
          <Route exact path="/" component={BlogMainPage} />
          <Route exact path="/Search" component={BlogSearchPage} />
          <Route exact path="/posts/:id" component={BlogPostSinglePage} />
          <PrivateRoute path='/create' roles={["admin"]} component={CreateBlogPostPage} />
          {/* <Route exact path="/create" component={CreateBlogPostPage} /> */}
          <PrivateRoute path='/edit/:id' roles={["admin"]} component={EditBlogPostPage} />
          {/* <Route exact path="/edit/:id" component={EditBlogPostPage} /> */}
          <PrivateRoute path='/admin' roles={["admin"]} component={BlogAdminPage} />
          {/* <Route exact path="/admin" component={BlogAdminPage} /> */}
          <UnPrivateRoute path='/login' component={Login}/>
          <UnPrivateRoute path='/register' component={Register}/>
         {/*  <Route exact path="/login" component={Login} /> */}
          {/* <Route exact path="/register" component={Register} /> */}
       
         </Container>
         
    </Router> 
    
  );
}
/*"exact" definition(s): 
https://stackoverflow.com/questions/49162311/react-difference-between-route-exact-path-and-route-path
https://reactrouter.com/web/api/Route/exact-bool
*/
export default App;