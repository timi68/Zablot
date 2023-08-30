import { Button, Avatar } from "@mui/material";
import * as Interfaces from "@lib/interfaces";
import stringToColor from "@utils/stringToColor";

interface RequestsInterface {
  friend: Interfaces.Requests;
  accept(user: Interfaces.Requests): void;
  reject(id: string): void;
  duration: string;
  message(id: string): void;
}

export default function Requests(props: RequestsInterface) {
  const { friend, duration, accept, reject, message } = props;

  return (
    <li className="user flex justify-between">
      <div className="flex gap-x-2">
        <Avatar
          src={friend.image}
          sx={{
            bgcolor: stringToColor(friend.name),
          }}
        >
          {friend.name.split(" ")[0][0] +
            (friend.name.split(" ")[1]?.at(0) ?? "")}
        </Avatar>
        <div className="user-name">
          <div className="name font-semibold">
            <span>{friend.name}</span>
          </div>
          {/* <div className="username !text-xs">
            <span>@{friend.userName}</span>
          </div> */}
          <small className="block text-[10px]" style={{ fontSize: 10 }}>
            {" "}
            {duration} ago
          </small>
        </div>
      </div>
      {friend?.accepted && (
        <Button
          size="small"
          className="btn open-chat"
          onClick={() => message(friend.from)}
        >
          Message
        </Button>
      )}
      {friend?.rejected && (
        <Button size="small" className="btn rejected" disabled={true}>
          rejected
        </Button>
      )}
      {!friend?.accepted && !friend?.rejected && (
        <div className="friend-reject-accept-btn btn-wrapper">
          <Button
            size="small"
            onClick={(e) => {
              accept(friend);
            }}
            className="accept btn !bg-green text-white"
          >
            <span className="accept-text ">Accept</span>
          </Button>
          <Button
            size="small"
            onClick={(e) => {
              reject(friend.from);
            }}
            className="reject btn button !bg-gradient-to-r from-red-200"
          >
            <span className="reject-text">Reject</span>
          </Button>
        </div>
      )}
    </li>
  );
}
