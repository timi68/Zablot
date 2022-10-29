import React from "react";
import { format } from "date-fns";
import GroupMessage from "@lib/Group_Message";
import { MessageType } from "@lib/interfaces";

interface MessageElement {
  type: "in" | "out";
  message: MessageType;
  pre: Date;
}

function Message(props: MessageElement) {
  const { type, message, pre } = props;

  let className = type == "in" ? "incoming-message" : "outgoing-message";
  const Group = GroupMessage({ cur: new Date(message.date), pre });

  return (
    <React.Fragment>
      {Group && (
        <div className="group">
          <span>{Group}</span>
        </div>
      )}
      <div className={className}>
        <div className="message-wrapper">
          <div className="plain-message">
            <div className="text">{message.message}</div>
            <span className="time">
              <small>{format(new Date(message.date), "HH:mm")}</small>
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default React.memo(Message);
