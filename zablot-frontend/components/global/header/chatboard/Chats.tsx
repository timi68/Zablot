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
import { format, formatRelative, isYesterday, isToday } from "date-fns";
import simulateClick from "@lib/simulateClick";

interface chats {
  friendId: string;
  friend: Interface.Friend;
}

const getRelative = (time: number) => {
  let date = new Date(time);
  let n = format(date, "HH:mm");

  return isToday(date)
    ? n
    : isYesterday(date)
    ? "Yesterday at " + n
    : format(date, "dd/mmm/yyyy");
};

function Chats({ friendId, friend }: chats): JSX.Element {
  const CardRef = React.useRef<HTMLDivElement>(null);

  useCustomEventListener(
    "openRoomById",
    (id: string) => {
      if (friend.id === id) CardRef.current.click();
    },
    [friend]
  );

  return (
    <CardActionArea
      component={"div"}
      ref={CardRef}
      className="chats_listItem list_item chat"
      role="listitem"
      onClick={(e) => {
        emitCustomEvent("openRoom", { friend, target: e.target });
        emitCustomEvent("remove_overlay");
      }}
    >
      <StyledBadge active={friend.active}>
        <Avatar
          variant={"rounded"}
          src={friend.image}
          sx={{
            borderRadius: "10px",
            bgcolor: stringToColor(friend.name),
          }}
        >
          {friend.name.split(" ")[0][0] +
            (friend.name.split(" ")[1]?.at(0) ?? "")}
        </Avatar>
      </StyledBadge>
      <div className="text" role="listitem">
        <div className="wrap">
          <div className="text-sm font-semibold text-ellipsis pr-1 capitalize max-w-[70%] overflow-clip">
            {friend.name}
          </div>
          <div
            className="time text-xs leading-[10px] text-[0.55em] max-w-[35%] font-medium"
            style={{ whiteSpace: "break-spaces" }}
          >
            {getRelative(friend.time)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="last_message secondary_text flex-grow">
            {friend?.lastPersonToSendMessage === friendId && <b>You: </b>}
            {friend.lastMessage === "image" ? (
              <ImageOutlinedIcon fontSize="small" />
            ) : (
              friend.lastMessage
            )}
          </div>
          {Boolean(friend.unseenMessages) && (
            <div className="unseenmessages badge bg-green text-white">
              {friend.unseenMessages}
            </div>
          )}
        </div>
      </div>
    </CardActionArea>
  );
}

export default React.memo(Chats);
