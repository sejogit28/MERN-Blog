import React, {useEffect, useState, useContext} from 'react';
import { Grid, Card, Form, Image, Button, Icon/* Header, Divider, Message */} from 'semantic-ui-react';
//import moment from 'moment';

import {AuthContext} from '../context/AuthContext';
import UserService from '../Services/UserService';

const UserProfilePage = props => {
     const{isAuthenticated, user} = useContext(AuthContext);
     const [userInfo, setUserInfo] = useState();

     useEffect(() => 
     {
        UserService.viewSingleUser(props.match.params.id).then(userData =>
        {
            setUserInfo(userData);
            console.log(userData);
        })
         
     }, [])

    return (
        <>
            {
                userInfo &&
                /* Enter Bio/Upload new Profile Pic == New Routes... */
                    <Card>
                        <Image src={`/UserImages/${userInfo.userImageUrl}`} wrapped ui={false} />
                        <Card.Content>
                            <Card.Header>{userInfo.username} <br/> {userInfo.email}</Card.Header>
                            <Card.Meta>
                                <span className='date'>Joined: {userInfo.createdAt.substring(0,10)}</span>
                            </Card.Meta>
                            <Card.Description>
                                {userInfo.Bio ? userInfo.Bio : "No Bio entered"}
                            </Card.Description>
                        </Card.Content>
                            <Card.Content extra>
                                <Button basic color='black' animated>
                                    <Button.Content visible>
                                        Edit Bio?
                                    </Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='edit' />
                                    </Button.Content>
                                </Button>
                                <Button basic color='black' animated>
                                    <Button.Content visible>
                                        Change Profile Pic
                                    </Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='upload' />
                                    </Button.Content>
                                </Button>
                            </Card.Content>
                    </Card> 
            } 
        </>
    )
}

export default UserProfilePage
