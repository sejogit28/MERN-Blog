import React, { useState, useContext } from "react";
import { Form, Button } from "semantic-ui-react";

import { AuthContext } from "../context/AuthContext";
import blogPostService from "../Services/BlogPostService";

const CommForm = (props) => {
  const { user } = useContext(AuthContext);
  const [comm, setComm] = useState({
    username: user.username,
    commBody: "",
  });

  const [comms, setComms] = useState({});
  const onCommInputChange = (e) => {
    setComm({ ...comm, [e.target.name]: e.target.value });
  };

  const onCommSubmit = (e) => {
    console.log(comm);
    e.preventDefault();
    blogPostService.addComment(props.blogPost._id, comm).then((data) => {
      console.log(data);
    });

    setComm({
      username: user.username,
      commBody: "",
    });
    blogPostService.getBlogPost(props.blogPost._id).then((getData) => {
      return setComms(comms);
    });
  };

  return (
    <Form onSubmit={onCommSubmit}>
      <Form.TextArea
        placeholder="Post A Comment!!"
        type="text"
        name="commBody"
        onChange={onCommInputChange}
        value={comm.commBody}
      />
      <Button fluid primary type="submit">
        Post a Comment
      </Button>
    </Form>
  );
};

export default CommForm;
