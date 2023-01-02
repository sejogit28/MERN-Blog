import React, { useState, useEffect } from "react";
import { Grid, Form, Button, Divider } from "semantic-ui-react";
import Editor from "react-medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";

import BlogPostService from "../../Services/BlogPostService";
import PopupMessage from "../components/PopupMessage";
import tagOptions from "../components/TagOptions";

const EditBlogPostPage = (props) => {
  const [editedBlogPost, setEditedBlogPost] = useState({
    title: "",
    author: "",
    summary: "",
    body: "",
    imageUrl: "",
    readTime: 0,
    date: new Date(),
    tags: [],
  });

  const [message, setMessage] = useState({
    icon: "",
    hidden: true,
    positive: false,
    negative: false,
    header: "",
    content: "",
  });

  const dismissMessage = () => {
    setMessage({
      icon: "",
      hidden: true,
      positive: false,
      negative: false,
      header: "",
      content: "",
    });
  };

  const id = props.match.params.id;

  useEffect(() => {
    BlogPostService.getBlogPost(id).then((data) => {
      setEditedBlogPost(data);
      /*If one of the fields the server is looking for isn't included, the server 
                will return an error. However, with the makeup of this project, that error 
                will be shown in the console as happening at the BlogPostService.
                (date : data.date example)*/
    });
  }, [id]);

  const handleInputChange = (e) => {
    setEditedBlogPost({ ...editedBlogPost, [e.target.name]: e.target.value });
    console.log(editedBlogPost);
  };
  const onCheckBoxChange = (e) => {
    const checkedVal = e.target.name;

    if (e.target.checked) {
      editedBlogPost.tags.push(checkedVal);
      setEditedBlogPost({ ...editedBlogPost, ...editedBlogPost.tags });
      console.log(editedBlogPost.tags);
    } else {
      let currentValueIndex = editedBlogPost.tags.indexOf(e.target.value);
      let result = editedBlogPost.tags.splice(currentValueIndex, 1);
      setEditedBlogPost({
        ...editedBlogPost,
        [{ ...editedBlogPost.tags }]: { ...result },
      });
      console.log(editedBlogPost.tags);
    }
  };

  const onSubmitForm = (e) => {
    e.preventDefault();

    if (editedBlogPost.body.length < 50) {
      setMessage({
        icon: "x",
        hidden: false,
        negative: true,
        header: "Error, article not posted",
        content: "Article body must have atleast fifty character",
      });
    } else {
      console.log({ ...editedBlogPost });

      setMessage({
        icon: "check circle outline",
        hidden: false,
        positive: true,
        header: "Article Posted!!!",
      });

      setTimeout(() => {
        dismissMessage();
      }, 4000);

      BlogPostService.editBlogPostNoPic(id, editedBlogPost).then((data) => {
        console.log(data);
        props.history.push("/admin");
      });
    }
  };

  return (
    <>
      <Grid padded="vertically">
        <Grid.Row centered>
          <h1>Edit This Post!!</h1>
        </Grid.Row>

        <Divider />

        <Grid.Row>
          <Grid.Column>
            <Form onSubmit={onSubmitForm}>
              <Form.Input
                required
                label="Title"
                placeholder="A few words..."
                type="text"
                name="title"
                value={editedBlogPost.title}
                onChange={handleInputChange}
                width={9}
              />

              <Form.Input
                required
                label="Author"
                placeholder="Your Name!"
                type="text"
                name="author"
                onChange={handleInputChange}
                value={editedBlogPost.author}
                width={6}
              />

              <Form.Input
                required
                label="Summary"
                placeholder="A sentence or two..."
                type="text"
                name="summary"
                onChange={handleInputChange}
                value={editedBlogPost.summary}
              />

              <br />

              <Editor
                text={editedBlogPost.body}
                onChange={(body) => {
                  setEditedBlogPost({ ...editedBlogPost, body: body });
                }}
              />

              {/* Needs to be moved to a see-able place */}
              <PopupMessage
                onDismiss={() => {
                  dismissMessage();
                }}
                hidden={message.hidden}
                positive={message.positive}
                negative={message.negative}
                floating
                icon={message.icon}
                header={message.header}
                content={message.content}
              />

              <br />

              <Form.Input
                required
                label="Read Time"
                type="Number"
                name="readTime"
                onChange={handleInputChange}
                value={editedBlogPost.readTime}
                width={2}
              />

              <Form.Input
                disabled
                label="Date"
                name="date"
                onChange={handleInputChange}
                value={editedBlogPost.date}
                width={2}
              />

              <Form.Input
                disabled
                label="Image Path"
                name="imageUrl"
                onChange={handleInputChange}
                value={editedBlogPost.imageUrl}
                width={12}
              />

              <Form.Group grouped>
                <label>Tags</label>
                {tagOptions.map((tagOp) => {
                  return editedBlogPost &&
                    editedBlogPost.tags.includes(tagOp) ? (
                    <Form.Field
                      checked
                      label={`${tagOp}`}
                      name={`${tagOp}`}
                      value={`${tagOp}`}
                      control="input"
                      type="checkbox"
                      onChange={onCheckBoxChange}
                    />
                  ) : (
                    <Form.Field
                      label={`${tagOp}`}
                      name={`${tagOp}`}
                      value={`${tagOp}`}
                      control="input"
                      type="checkbox"
                      onChange={onCheckBoxChange}
                    />
                  );
                })}
                <br />
              </Form.Group>

              <Button type="submit" color="black">
                Edit This Post
              </Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default EditBlogPostPage;
