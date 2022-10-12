import { format } from "date-fns";
import React from "react";
import * as Interfaces from "../../../lib/interfaces";
import GroupMessage from "./Group_Message";

function OutgoingMessage(props: {
  message: Interfaces.MessageType;
  nextGoingId: boolean;
  // cur: Date;
  pre: Date | null;
}) {
  const { nextGoingId, message, pre } = props;
  const className = `outgoing-message${nextGoingId ? " adjust-mg" : ""} `;

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

export default React.memo(OutgoingMessage);
