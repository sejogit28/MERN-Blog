import React from "react";

import { Menu, Icon } from "semantic-ui-react";

const BlogFooter = () => {
  return (
    <Menu
      style={{ marginTop: "50px" }}
      icon="labeled"
      stackable
      attached="bottom"
      inverted
      size="massive"
      color="black"
      borderless
      widths={4}
    >
      <Menu.Item header icon="world">
        Coding Mind
      </Menu.Item>
      <Menu.Item header name="My Portfolio" href="https://sejose.tech">
        <Icon name="world" />
        My Portfolio
      </Menu.Item>
      <Menu.Item header name="My GitHub" href="https://github.com/sejogit28">
        <Icon name="github" />
        My GitHub
      </Menu.Item>

      <Menu.Item
        header
        name="My Linkedin"
        href="https://www.linkedin.com/in/sean-joseph-41ab49114/"
      >
        <Icon name="linkedin" />
        My Linkedin
      </Menu.Item>
    </Menu>
  );
};

export default BlogFooter;
