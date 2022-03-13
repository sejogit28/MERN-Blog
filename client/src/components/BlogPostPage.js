import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  Segment,
  Header,
  Comment,
  Icon,
  Form,
  Button,
  Divider,
  Placeholder,
  Image,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { localApiUrl } from "../Services/ServiceUtils";
import { AuthContext } from "../context/AuthContext";
import BlogPostService from "../Services/BlogPostService";
import BlogPostSinglePageComment from "./BlogPostPageComm";
import BlogPostSinglePageReplyComm from "./BlogPostPageReplyComm";
import PopupMessage from "./PopupMessage";

const BlogPostSinglePage = (props) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [loaded, setLoaded] = useState(false);
  const [socket, setSocket] = useState(null);
  const [blogPost, setBlogPost] = useState({
    createdAt: "",
    comments: [],
  });
  /*The comments array and createdAt var are intialized to avoid an error since
        the data isn't loaded fast enough */

  const [commValue, setCommValue] = useState({
    username: user.username,
    commBody: "",
    postfinder: props.match.params.id,
    posterImageUrl: user.userImageUrl,
  });

  const [commMessage, setCommMessage] = useState({
    icon: "",
    hidden: true,
    positive: false,
    negative: false,
    header: "",
    content: "",
  });

  const dismissCommMessage = () => {
    setCommMessage({
      icon: "",
      hidden: true,
      positive: false,
      negative: false,
      header: "",
      content: "",
    });
  };

  useEffect(() => {
    BlogPostService.getBlogPost(props.match.params.id).then((postdata) => {
      setBlogPost(postdata);
      setLoaded(true);
    });

    const socket = io(`${localApiUrl}/`, {
      withCredentials: true,
    });
    /* in this video: https://youtu.be/tBKUxOdK5Q8?t=2633 a global state was used to 
        set up the socket. However, this seems to have worked without using a global state*/
    setSocket(socket);
    return () => socket.close();
  }, [props.match.params.id]);

  const postId = props.match.params.id;

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", postId);
    }
  }, [socket, postId]);

  useEffect(() => {
    if (socket) {
      socket.on("sendCommentToClient", (msg) => {
        setBlogPost({ ...msg });
      });
      return () => socket.off("sendCommentToClient");
    }
  }, [socket, blogPost]);

  const LoggedInCommMessage = () => {
    return (
      <Segment textAlign="center">
        <h2>
          What Do You Think? <Icon name="comments outline" size="large" />
        </h2>
      </Segment>
    );
  };

  const LoggedOutCommMessage = () => {
    return (
      <Segment textAlign="center">
        <Icon name="comments outline" size="huge" />
        <h2>
          <Link to="/login"> Log-In </Link>
          --OR--
          <Link to="/register"> Sign-Up </Link>
          To Join The Discussion.
        </h2>
      </Segment>
    );
  };

  const PlaceholderComponent = () => {
    return (
      <Placeholder fluid>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
      </Placeholder>
    );
  };

  const onCommBodyChange = (e) => {
    setCommValue({ ...commValue, [e.target.name]: e.target.value });
  };

  const onCommSubmit = (e) => {
    e.preventDefault();

    console.log(commValue);
    const { commBody, postfinder, username, parentcommfinder, posterImageUrl } =
      commValue;

    const oneCharNoWhiteSpaceRegex = /([a-zA-Z])+([ -~])*/;

    if (commBody === "" || oneCharNoWhiteSpaceRegex.test(commBody) === false) {
      setCommMessage({
        icon: "x",
        hidden: false,
        negative: true,
        header: "Error, comment not posted",
        content: "Comment body must have atleast one character",
      });
      e.target.reset();
    } else {
      socket.emit("createComment", {
        commBody,
        postfinder,
        username,
        parentcommfinder,
        posterImageUrl,
      });

      setCommMessage({
        icon: "check circle outline",
        hidden: false,
        positive: true,
        header: "Comment Posted",
      });

      setTimeout(() => {
        dismissCommMessage();
      }, 2000);

      setCommValue({
        username: user.username,
        commBody: "",
        postfinder: props.match.params.id,
        posterImageUrl: user.userImageUrl,
      });
      e.target.reset();
    }
  };

  return loaded ? (
    <>
      {blogPost && (
        <>
          <Grid centered padded>
            <Image
              src={blogPost.imageUrl}
              fluid
              size="massive"
              style={{ minWidth: "100px", minHeight: "100px" }}
            />
          </Grid>

          <Grid centered>
            <Grid.Column computer={12} mobile={16} tablet={16}>
              <h1>{blogPost.title}</h1>
              <h4>{blogPost.summary}</h4>
              <h5>
                Written by: {blogPost.author} on{" "}
                {blogPost.createdAt && blogPost.createdAt.substring(0, 10)}
              </h5>
              {blogPost.body && (
                <div dangerouslySetInnerHTML={{ __html: blogPost.body }}></div>
              )}
            </Grid.Column>
          </Grid>
        </>
      )}

      <Comment.Group>
        <Header as="h2" dividing>
          Comments
        </Header>

        {!isAuthenticated ? LoggedOutCommMessage() : LoggedInCommMessage()}

        {isAuthenticated && (
          <Form onSubmit={onCommSubmit}>
            <Form.TextArea
              required
              placeholder="Post A Comment!!"
              type="text"
              name="commBody"
              onChange={onCommBodyChange}
            />
            <Button fluid color="black" type="submit">
              Post a Comment
            </Button>
            <PopupMessage
              onDismiss={() => {
                dismissCommMessage();
              }}
              hidden={commMessage.hidden}
              positive={commMessage.positive}
              negative={commMessage.negative}
              floating
              icon={commMessage.icon}
              header={commMessage.header}
              content={commMessage.content}
            />
          </Form>
        )}

        {blogPost.comments &&
          blogPost.comments
            .slice()
            .reverse()
            .map(
              (comm) =>
                !comm.parentcommfinder && (
                  /*IMPORTANT, in order for this to work the props MUST be passed down correctly
                    https://github.com/jaewonhimnae/react-youtube-clone/blob/master/client/src/components/views/DetailVideoPage/DetailVideoPage.js
                    https://github.com/jaewonhimnae/react-youtube-clone/blob/master/client/src/components/views/DetailVideoPage/Sections/Comments.js
                    https://github.com/jaewonhimnae/react-youtube-clone/blob/master/client/src/components/views/DetailVideoPage/Sections/ReplyComment.js*/
                  <>
                    <BlogPostSinglePageComment //aka SingleComment
                      key={comm._id}
                      comm={comm}
                      user={user}
                      getBlogPost={BlogPostService.getBlogPost}
                      setBlogPost={setBlogPost}
                      postComments={blogPost.comments}
                      postId={comm.postfinder}
                      parentCommentId={comm._id}
                      isAuthenticated={isAuthenticated}
                      onCommSubmit={onCommSubmit}
                      socket={socket}
                      dismissCommMessage={dismissCommMessage}
                    />
                    <BlogPostSinglePageReplyComm //aka ReplyComment
                      postComments={blogPost.comments}
                      comm={comm}
                      user={user}
                      postId={comm.postfinder}
                      isAuthenticated={isAuthenticated}
                      parentCommentId={comm._id}
                      getBlogPost={BlogPostService.getBlogPost}
                      setBlogPost={setBlogPost}
                      onCommSubmit={onCommSubmit}
                      socket={socket}
                      dimissCommMessage={dismissCommMessage}
                    />
                    {/* <br></br> */}
                    <Divider />
                  </>
                )
            )}
      </Comment.Group>
    </>
  ) : (
    <>
      <PlaceholderComponent />
      <PlaceholderComponent />
      <PlaceholderComponent />
    </>
  );
};

export default BlogPostSinglePage;
