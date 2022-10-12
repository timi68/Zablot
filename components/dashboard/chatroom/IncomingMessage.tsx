import { format } from "date-fns";
import React from "react";
import * as Interfaces from "../../../lib/interfaces";
import GroupMessage from "./Group_Message";

function IncomingMessage(props: {
  message: Interfaces.MessageType;
  nextComingId: boolean;
  cur: Date;
  pre: Date | null;
  // i: number;
}) {
  const { message, nextComingId, cur, pre } = props;
  const className = `incoming-message${nextComingId ? " adjust-mg" : ""}`;

  const Group = GroupMessage({ cur, pre });

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
              <small>{format(cur, "HH:mm")}</small>
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default React.memo(IncomingMessage);
