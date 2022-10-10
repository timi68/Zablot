import React from "react";
import { Socket } from "socket.io";
import Time from "@utils/CalculateTime";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Stack from "@mui/material/Stack";
import { Friend } from "@types";
import { getRoom, removeRoom } from "@lib/redux/roomSlice";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";

type RoomHeaderPropsType = {
  room_id: string | number;
};
function RoomHeader({ room_id }: RoomHeaderPropsType) {
  const target = useAppSelector((state) => getRoom(state, room_id).target);
  const user = useAppSelector((state) => getRoom(state, room_id).user);
  const {
    socket,
    user: { _id },
  } = useAppSelector((state) => state.sessionStore);
  const dispatch = useAppDispatch();
  const statusRef = React.useRef<HTMLDivElement>();
  const userImageRef = React.useRef<HTMLDivElement>();

  const UpdateRooms = (): void => {
    dispatch(removeRoom(room_id));
  };
  const _callback$Status = React.useCallback(
    (data: { _id: string; online: boolean; Last_Seen: Date }) => {
      console.log({ data, _id, text: statusRef.current.innerHTML });
      if (data._id === _id) {
        statusRef.current.innerHTML = data.online
          ? "online"
          : `last seen ${Time(data.Last_Seen)}`;

        if (data.online) {
          userImageRef.current
            .querySelector(".user_active_signal")
            .classList.remove("offline");
        } else {
          userImageRef.current
            .querySelector(".user_active_signal")
            .classList.add("offline");
        }
      }
    },
    [_id]
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
        <div
          className="avatar user_image list_item"
          ref={userImageRef}
          dangerouslySetInnerHTML={{
            __html: String(target.closest(".chat").children[0].innerHTML),
          }}
        />
        <div className="name">
          <span className="textname">{user?.Name}</span>
          <div className="active-sign">
            <div className="active-text" ref={statusRef}>
              {user.active ? "online" : `offline`}
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
