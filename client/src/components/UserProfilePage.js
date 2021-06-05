import React, {useEffect, useState, useContext} from 'react';
import { Grid, Card, Form, Image, /* , Header, Icon, , Button, Divider, Message */} from 'semantic-ui-react';
import moment from 'moment';

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
                            <Card.Header>{userInfo.username}</Card.Header>
                            <Card.Meta>
                                <span className='date'>Joined: {userInfo.createdAt.substring(0,10)}</span>
                            </Card.Meta>
                            <Card.Description>
                                {userInfo.Bio ? userInfo.Bio : "No Bio entered"}
                            </Card.Description>
                            </Card.Content>
                                <Card.Content extra>
                                    <p>
                                        {userInfo.email}
                                    </p>
                                </Card.Content>
                    </Card> 
            } 
        </>
    )
}

export default UserProfilePage
