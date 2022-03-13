import React from "react";
import { Message } from "semantic-ui-react";

const PopupMessage = (props) => {
  return (
    <Message
      onDismiss={props.onDismiss}
      hidden={props.hidden}
      positive={props.positive}
      negative={props.negative}
      floating
      icon={props.icon}
      header={props.header}
      content={props.content}
    />
  );
};

export default PopupMessage;
