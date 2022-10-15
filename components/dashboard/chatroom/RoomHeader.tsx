import React from "react";
import { Socket } from "socket.io";
import Time from "@utils/CalculateTime";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Stack from "@mui/material/Stack";
import { Friend } from "@types";
import { getRoom } from "@lib/redux/roomSlice";
import { useAppSelector } from "@lib/redux/store";
import { Avatar } from "@mui/material";
import StyledBadge from "@comp/dashboard/chatboard/StyledBadge";
import stringToColor from "@utils/stringToColor";
import { format } from "date-fns";
import { emitCustomEvent } from "react-custom-events";

type RoomHeaderPropsType = {
  room_id: string | number;
};
function RoomHeader({ room_id }: RoomHeaderPropsType) {
  const friend = useAppSelector((state) => getRoom(state, room_id).friend);
  const [online, setOnline] = React.useState(friend.active);
  const {
    socket,
    user: { _id },
  } = useAppSelector((state) => state.sessionStore);
  const statusRef = React.useRef<HTMLDivElement>();

  const UpdateRooms = (): void => {
    emitCustomEvent("removeRoom", room_id);
  };

  const _callback$Status = React.useCallback(
    (data: { _id: string; online: boolean; Last_Seen: Date }) => {
      if (data._id === friend.Id) {
        setOnline(data.online);
      }
    },
    [friend.Id]
  );

  React.useEffect(() => {
    socket.on("STATUS", _callback$Status);
    return () => {
      socket.off("STATUS", _callback$Status);
    };
  }, [_callback$Status, socket]);

  return (
    <div className="room-header">
      <div className="profile">
        <StyledBadge active={online}>
          <Avatar
            src={friend.Image}
            sx={{
              width: 30,
              height: 30,
              fontSize: "14px",
              bgcolor: stringToColor(friend.Name),
            }}
          >
            {friend.Name.split(" ")[0][0] +
              (friend.Name.split(" ")[1]?.at(0) ?? "")}
          </Avatar>
        </StyledBadge>
        <div className="name">
          <span className="textname">{friend?.Name}</span>
          <div className="active-sign">
            <div className="active-text" ref={statusRef}>
              {online
                ? "online"
                : "Last seen at " + format(new Date(), "HH:mm")}
            </div>
          </div>
        </div>
        <div className="options">
          <div className="options-list">
            <div className="option navigate"></div>
          </div>
        </div>
      </div>
      <Stack direction="row" spacing={1}>
        <IconButton
          size="small"
          className="toggle-menu icon"
          data-role="toggle room menu"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={UpdateRooms}
          className="close-card icon"
          data-role="close room"
        >
          <CancelIcon fontSize="small" />
        </IconButton>
      </Stack>
    </div>
  );
}

export default RoomHeader;
