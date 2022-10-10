import SecurityIcon from "@mui/icons-material/Security";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { Button, CardActionArea } from "@mui/material";
import Image from "next/image";
import * as Interface from "@lib/interfaces";
import React from "react";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";

interface chats {
  friendId: string;
  user: Interface.Friend;
}
/**
 *
 */
function Chats({ friendId, user }: chats): JSX.Element {
  const CardRef = React.useRef<HTMLDivElement>(null);

  useCustomEventListener(
    "openRoomById",
    (id: string) => {
      console.log("OpenRoomID", id, user.Id);
      if (user.Id === id) CardRef.current.click();
    },
    [user]
  );

  return (
    <CardActionArea
      component={"div"}
      ref={CardRef}
      className="chats_listItem list_item chat"
      role="listitem"
      onClick={(e) => emitCustomEvent("openRoom", { user, target: e.target })}
    >
      <div className="avatar user_image list_item" role="listitem">
        <Image
          src={"/images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"}
          alt={user.Name}
          layout="fill"
          role="img"
          className="image list_image"
        />
        <div
          className={`badge user_active_signal ${
            user.active ? "" : " offline"
          }`}
        />
      </div>
      <div className="text" role="listitem">
        <div className="wrap">
          <div className="text-sm font-semibold capitalize">{user.Name}</div>
          {Boolean(user.UnseenMessages) && (
            <div className="unseenmessages badge bg-green text-white">
              {user.UnseenMessages}
            </div>
          )}
        </div>
        <div className="last_message secondary_text text-xs">
          {user?.LastPersonToSendMessage === friendId && <b>You: </b>}
          {user.Last_Message === "Image" ? (
            <ImageOutlinedIcon fontSize="small" />
          ) : (
            user.Last_Message
          )}
        </div>
      </div>
    </CardActionArea>
  );
}

export default Chats;
