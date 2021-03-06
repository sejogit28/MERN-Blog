//...https://www.youtube.com/watch?v=uWVx6Jt4Rqw
import React, { createContext, useState, useEffect } from "react";
import { Segment, Dimmer, Image, Loader } from "semantic-ui-react";

import AuthServices from "../Services/AuthServices";

/*The context api gives you a provider and a consumer. Anything that's wrapped
 in a provider has access to the global state*/
export const AuthContext = createContext();

const ClientAuth = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AuthServices.isAuthenticated().then((data) => {
      setUser(data.user);
      setIsAuthenticated(data.isAuthenticated);
      setLoaded(true);
    });
  }, []);

  return (
    <div>
      {!loaded ? (
        <Segment>
          <Dimmer active>
            <Loader inverted size="massive">
              Loading
            </Loader>
          </Dimmer>

          <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
          <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
          <Image src="https://react.semantic-ui.com/images/wireframe/paragraph.png" />
        </Segment>
      ) : (
        <AuthContext.Provider
          value={{ user, setUser, isAuthenticated, setIsAuthenticated }}
        >
          {children}
        </AuthContext.Provider>
      )}
    </div>
  );
};

export default ClientAuth;
