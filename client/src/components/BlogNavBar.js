import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthServices from "../Services/AuthServices";
import { AuthContext } from "../context/AuthContext";
import { Menu } from "semantic-ui-react";

const BlogNavBar = () => {
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substring(1);

  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);
  /*Semantic-ui-React integrates with the 'link' from React-router-dom so 
instead of changing the <a> tag to a <Link> you just write "as=Link"*/

  const { isAuthenticated, user, setIsAuthenticated, setUser } =
    useContext(AuthContext);

  const logOutActivator = () => {
    AuthServices.logout().then((data) => {
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(false);
      }
    });
  };

  const unauthenticatedNavBar = () => {
    return (
      <>
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
          icon="sign in alternate"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
          icon="signup"
        />
      </>
    );
  };

  const authenticatedNavBar = () => {
    return (
      <>
        {user.role === "admin" ? (
          <Menu.Item
            name="admin"
            active={activeItem === "admin"}
            onClick={handleItemClick}
            as={Link}
            to="/admin"
            icon="chess king"
          />
        ) : null}

        {user.role === "admin" ? (
          <Menu.Item
            name="Create Post"
            active={activeItem === "Create Post"}
            onClick={handleItemClick}
            as={Link}
            to="/create"
            icon="add"
          />
        ) : null}

        <Menu.Item as={Link} to={`/userProfile/${user._id}`} header>
          {" "}
          Hello, {user.username}!
        </Menu.Item>

        <Menu.Item name="logout" onClick={logOutActivator} icon="log out" />
      </>
    );
  };

  return (
    <Menu stackable inverted size="massive" color="black" attached="top">
      <Menu.Item header>Coding Mind</Menu.Item>
      <Menu.Item
        name="Home"
        active={activeItem === "Home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
        icon="home"
      />
      <Menu.Item
        name="search"
        active={activeItem === "search"}
        onClick={handleItemClick}
        as={Link}
        to="/Search"
        icon="search"
      />
      <Menu.Menu position="right">
        {!isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}
      </Menu.Menu>
    </Menu>
  );
};

export default BlogNavBar;
