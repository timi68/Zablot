import SecurityIcon from "@mui/icons-material/Security";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { Avatar, Button, CardActionArea } from "@mui/material";
import Image from "next/image";
import * as Interface from "@lib/interfaces";
import React from "react";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import StyledBadge from "./StyledBadge";
import stringToColor from "@utils/stringToColor";
import { format } from "date-fns";

interface chats {
  friendId: string;
  friend: Interface.Friend;
}

function Chats({ friendId, friend }: chats): JSX.Element {
  const CardRef = React.useRef<HTMLDivElement>(null);

  useCustomEventListener(
    "openRoomById",
    (id: string) => {
      if (friend.Id === id) CardRef.current.click();
    },
    [friend]
  );

  return (
    <CardActionArea
      component={"div"}
      ref={CardRef}
      className="chats_listItem list_item chat"
      role="listitem"
      onClick={(e) => emitCustomEvent("openRoom", { friend, target: e.target })}
    >
      <StyledBadge active={friend.active}>
        <Avatar
          variant={"rounded"}
          src={friend.Image}
          sx={{
            borderRadius: "10px",
            bgcolor: stringToColor(friend.Name),
          }}
        >
          {friend.Name.split(" ")[0][0] +
            (friend.Name.split(" ")[1]?.at(0) ?? "")}
        </Avatar>
      </StyledBadge>
      <div className="text" role="listitem">
        <div className="wrap">
          <div className="text-sm font-semibold capitalize">{friend.Name}</div>
          <div className="time text-xs">{format(friend.time, "HH:mm")}</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="last_message secondary_text flex-grow">
            {friend?.LastPersonToSendMessage === friendId && <b>You: </b>}
            {friend.Last_Message === "Image" ? (
              <ImageOutlinedIcon fontSize="small" />
            ) : (
              friend.Last_Message
            )}
          </div>
          {Boolean(friend.UnseenMessages) && (
            <div className="unseenmessages badge bg-green text-white">
              {friend.UnseenMessages}
            </div>
          )}
        </div>
      </div>
    </CardActionArea>
  );
}

export default React.memo(Chats);
