import React, { useEffect, useState, useContext, useRef } from "react";
import { Grid, Card, Form, Image, Button, Icon } from "semantic-ui-react";

import PopupMessage from "./PopupMessage";
import { AuthContext } from "../context/AuthContext";
import UserService from "../Services/UserService";

const UserProfilePage = (props) => {
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState();
  const [file, setFile] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [profilePicForm, setProfilePicForm] = useState(false);
  const [newBioForm, setNewBioForm] = useState(false);
  const [message, setMessage] = useState({
    icon: "",
    hidden: true,
    positive: false,
    negative: false,
    header: "",
    content: "",
  });

  const scrollRef = useRef(null);
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

  useEffect(() => {
    UserService.viewSingleUser(props.match.params.id).then((userData) => {
      setUserInfo(userData);
      setImageUrl(userData.userImageUrl);
      console.log(userData);
    });
  }, [props.match.params.id, userInfo, imageUrl]);

  const showEditProfilePicForm = () => {
    setProfilePicForm(true);
    setTimeout(() => {
      window.scrollTo({
        top: scrollRef.current.offsetTop,
        behavior: "smooth",
        /* You can also assign value "auto"
            to the behavior parameter but smooth is alot 
            more jarring of a transition */
      });
    }, 500);
  };

  const showUpdateBioForm = () => {
    setNewBioForm(true);
    setTimeout(() => {
      window.scrollTo({
        top: scrollRef.current.offsetTop,
        behavior: "smooth",
      });
    }, 500);
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onBioChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const onSubmitNewBioForm = (e) => {
    //TO BE CONTINUED....
    e.preventDefault();
    console.log(userInfo);
    UserService.editUserBio(props.match.params.id, userInfo).then(
      (updatedBio) => {
        console.log(updatedBio);
        UserService.viewSingleUser(props.match.params.id).then(
          (newUserData) => {
            setUserInfo(newUserData);
            console.log(newUserData);
            setNewBioForm(false);
            setMessage({
              icon: "check circle outline",
              hidden: false,
              positive: true,
              header: "Bio Successfully Updated",
            });

            setTimeout(() => {
              dismissMessage();
            }, 2000);
          }
        );
      }
    );
    console.log();
  };

  const onSubmitProfilePicForm = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("newUserImage", file);
    UserService.editUserProfilePic(props.match.params.id, formData).then(
      (data) => {
        console.log(data);
        UserService.viewSingleUser(props.match.params.id).then(
          (newUserData) => {
            setUserInfo(newUserData);
            console.log(newUserData);
            setProfilePicForm(false);

            setMessage({
              icon: "check circle outline",
              hidden: false,
              positive: true,
              header: "Profile Pic Successfully Updated",
            });

            setTimeout(() => {
              dismissMessage();
            }, 2000);
          }
        );
      }
    );
  };

  return (
    <>
      <Grid padded="vertically">
        <Grid.Row centered>
          <h1>Hello {user.username}!!</h1>
        </Grid.Row>

        <Grid.Row centered>
          {userInfo && (
            /* Enter Bio/Upload new Profile Pic == New Routes... */
            <Card raised>
              <Image src={imageUrl} wrapped ui={false} />
              <Card.Content>
                <Card.Header>
                  Username: {userInfo.username} <br /> Email: {userInfo.email}
                </Card.Header>
                <Card.Meta>
                  <span className="date">
                    Joined: {userInfo.createdAt.substring(0, 10)}
                  </span>
                </Card.Meta>
                <Card.Description>
                  {userInfo.bio ? userInfo.bio : "No Bio entered"}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                {!newBioForm ? (
                  <Button
                    basic
                    color="black"
                    animated
                    onClick={showUpdateBioForm}
                  >
                    <Button.Content visible>Edit Bio?</Button.Content>
                    <Button.Content hidden>
                      <Icon name="edit" />
                    </Button.Content>
                  </Button>
                ) : (
                  <Button
                    basic
                    color="black"
                    animated
                    onClick={() => {
                      setNewBioForm(false);
                    }}
                  >
                    <Button.Content visible>Cancel</Button.Content>
                    <Button.Content hidden>
                      <Icon name="cancel" />
                    </Button.Content>
                  </Button>
                )}

                {!profilePicForm ? (
                  <Button
                    basic
                    color="black"
                    animated
                    onClick={showEditProfilePicForm}
                  >
                    <Button.Content visible>Change Profile Pic</Button.Content>
                    <Button.Content hidden>
                      <Icon name="upload" />
                    </Button.Content>
                  </Button>
                ) : (
                  <Button
                    basic
                    color="black"
                    animated
                    onClick={() => {
                      setProfilePicForm(false);
                    }}
                  >
                    <Button.Content visible>Cancel</Button.Content>
                    <Button.Content hidden>
                      <Icon name="cancel" />
                    </Button.Content>
                  </Button>
                )}
              </Card.Content>
            </Card>
          )}

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
        </Grid.Row>

        {profilePicForm && (
          <Grid.Row centered>
            <Grid.Column>
              <Form
                onSubmit={onSubmitProfilePicForm}
                encType="multipart/form-data"
              >
                <br />

                <Form.Input
                  required
                  label="Submit New Profile Pic"
                  type="file"
                  onChange={onFileChange}
                  filename="newUserImage"
                  id="newUserImage"
                  width={6}
                />

                <Button type="submit" color="black">
                  Submit New Profile Pic
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        )}

        <br />

        {newBioForm && (
          <Grid.Row centered>
            <Grid.Column>
              <Form onSubmit={onSubmitNewBioForm}>
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

                <Form.TextArea
                  required
                  placeholder="Enter your bio here!"
                  type="text"
                  name="bio"
                  value={userInfo.bio}
                  width={6}
                  onChange={onBioChange}
                />

                <Button type="submit" color="black">
                  Update Bio!
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        )}
        <div ref={scrollRef}></div>
      </Grid>
    </>
  );
};

export default UserProfilePage;
