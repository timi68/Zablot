import React from "react";
import * as Interfaces from "../../../lib/interfaces";
import GroupMessage from "./Group_Message";

function OutgoingMessage(props: {
  message: Interfaces.MessageType;
  nextGoingId: boolean;
  hrs: number | string;
  mins: number | string;
  cur: Date;
  pre: Date | null;
  i: number;
}) {
  const { nextGoingId, message, hrs, mins, cur, pre, i } = props;
  const className = `outgoing-message${
    nextGoingId || i === 0 ? " adjust-mg" : ""
  } `;

  const time = hrs + ":" + mins;
  const Group = GroupMessage({ cur, pre, i });

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
              <small>{time}</small>
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default OutgoingMessage;
