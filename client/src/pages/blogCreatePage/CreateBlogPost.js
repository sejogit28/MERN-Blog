import React, { useState } from "react";
import { Grid, Form, Button, Divider } from "semantic-ui-react";
//import { EditorState, convertToRaw, getDefaultKeyBinding, RichUtils} from 'draft-js';
import "draft-js/dist/Draft.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Editor from "react-medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";

//import MyEditor from '../components/CreateBlogPostEditor';
import BlogPostService from "../../Services/BlogPostService";
import PopupMessage from "../components/PopupMessage";
import tagOptions from "../components/TagOptions";

const CreateBlogPostPage = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [readTime, setReadTime] = useState("");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState("");

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

  const onCheckBoxChange = (e) => {
    const checkedVal = e.target.name;
    function clearTags(tagsArr, value) {
      return tagsArr.filter(function (tag) {
        return tag !== value;
      });
    }

    if (e.target.checked) {
      tags.push(checkedVal);
      setTags(tags);
    } else {
      let result = clearTags(tags, e.target.name);
      setTags(result);
    }
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();

    if (body.length <= 50) {
      setMessage({
        icon: "x",
        hidden: false,
        negative: true,
        header: "Error, article not posted",
        content: "Article body must have atleast fifty character",
      });
    } else {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("summary", summary);
      formData.append("body", body);
      formData.append("readTime", readTime);
      tags.forEach((item) => {
        formData.append("tags", item);
      });
      formData.append("blogImage", file);

      setMessage({
        icon: "check circle outline",
        hidden: false,
        positive: true,
        header: "Article Posted!!!",
      });

      setTimeout(() => {
        dismissMessage();
      }, 2000);

      BlogPostService.addBlogPost(formData).then((data) => {
        console.log(data);
        props.history.push("/");
      });
    }
  };

  return (
    <>
      <Grid padded="vertically">
        <Grid.Row centered>
          <h1>Create A New Post!!!</h1>
        </Grid.Row>

        <Divider />

        <Grid.Row>
          <Grid.Column>
            <Form onSubmit={onSubmitForm} encType="multipart/form-data">
              <Form.Input
                required
                label="Title"
                placeholder="A few words..."
                type="text"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                width={9}
              />

              <Form.Input
                required
                label="Author"
                placeholder="Your Name!"
                type="text"
                name="author"
                onChange={(e) => setAuthor(e.target.value)}
                width={6}
              />

              <Form.Input
                required
                label="Summary"
                placeholder="A sentence or two..."
                type="text"
                name="summary"
                onChange={(e) => setSummary(e.target.value)}
              />

              <br />
              <Editor text={body} onChange={(body) => setBody(body)} />

              <br />

              <Form.Input
                required
                label="Image"
                type="file"
                onChange={onFileChange}
                filename="blogImage"
                id="blogImage"
              />

              <Form.Input
                required
                label="Read Time"
                type="Number"
                name="readTime"
                onChange={(e) => setReadTime(e.target.value)}
                width={2}
              />

              <Form.Group grouped>
                <label>Tags(Required)</label>
                {tagOptions.map((option) => {
                  return (
                    <Form.Field
                      label={option}
                      name={option}
                      value={option}
                      control="input"
                      type="checkbox"
                      onChange={onCheckBoxChange}
                    />
                  );
                })}{" "}
              </Form.Group>

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

              <Button primary type="submit">
                Create A Post!!
              </Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default CreateBlogPostPage;
