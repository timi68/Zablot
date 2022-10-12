import Image from "next/image";
import React from "react";
import { CircularProgress } from "@mui/material";
import * as Interface from "@lib/interfaces";
import Friends from "./Friends";
import j from "jquery";
import { useCustomEventListener } from "react-custom-events";
import store, { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { ACTIVE_FRIENDS } from "@lib/redux/userSlice";

const ChatBoard: React.FC = function () {
  const { user, activeFriends, socket } = useAppSelector((s) => s.sessionStore);
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [friends, setFriends] = React.useState<Interface.Friend[]>([]);
  const [loading, setLoading] = React.useState(!Boolean(activeFriends));
  const chatBoard = React.useRef<HTMLDivElement>(null);

  const NewFriend = React.useCallback((data: Interface.Friend) => {
    setFriends((friends) => [data, ...friends]);
  }, []);

  const _callback$IncomingMessage = React.useCallback(
    (data: Interface.MessageType) => {
      const roomIds = store.getState().rooms.ids;
      setFriends((state) => {
        const oldState = state.filter((user) => user.Id !== data.coming);
        let user = state.find((f) => f.Id === data.coming);
        user = {
          ...user,
          time: data.date,
          UnseenMessages: roomIds.includes(data.coming)
            ? 0
            : Number(user.UnseenMessages) + 1,
          Last_Message: data.message,
          LastPersonToSendMessage: data.coming,
        };
        oldState.unshift(user);

        return oldState;
      });

      if (roomIds.includes(data.coming)) CleanSeen(data._id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const _callback$Status = React.useCallback((data) => {
    setFriends((state) => {
      const newState = state.map((user) => {
        if (user.Id === data._id) {
          return { ...user, active: data.online };
        }
        return user;
      });

      return newState;
    });
  }, []);

  const handleActiveFriends = React.useCallback(
    (actives: string[]) => {
      setFriends((state) => {
        state = state.map((user) => {
          const _id = user.Id.slice(19, 24);
          return { ...user, active: actives.includes(_id) };
        });

        return state;
      });
      setLoading(false);
      dispatch(ACTIVE_FRIENDS(actives));
    },
    [dispatch]
  );

  function CleanSeen(id: string) {
    socket.emit(
      "CLEAN_SEEN",
      { _id: user._id, Id: id },
      (err: string, done: string) => {
        if (err) {
          alert("Internal server error: restarting window now");
        }
      }
    );
  }

  useCustomEventListener(
    "openRoom",
    ({ friend }: { friend: Interface.Friend }) => {
      if (friend.UnseenMessages == 0) return;
      setFriends((state) => {
        state = state.map((u) => {
          if (u.Id === friend.Id) {
            return { ...u, UnseenMessages: 0 };
          }
          return u;
        });
        return state;
      });
      CleanSeen(friend._id);
    }
  );

  useCustomEventListener(
    "Message",
    (data: { id: string; message: string; flow: string; time: number }) => {
      setFriends((prevFriends) => {
        return prevFriends.map((friend) => {
          if (friend.Id === data.id) {
            return {
              ...friend,
              time: data.time,
              Last_Message: data.message,
              LastPersonToSendMessage: data.flow,
            };
          }
          return friend;
        });
      });
    },
    []
  );

  useCustomEventListener(
    "newFriend",
    (friend: Interface.Friend) => {
      setFriends([friend, ...friends]);
    },
    [friends]
  );

  React.useEffect(() => {
    if (user) setFriends(user.Friends);
  }, [user]);

  React.useEffect(() => {
    if (socket) {
      socket.on("STATUS", _callback$Status);
      socket.on("INCOMINGMESSAGE", _callback$IncomingMessage);
      socket.on("NEW_FRIEND", NewFriend);
    }

    if (!activeFriends) socket.emit("ACTIVE_USERS", handleActiveFriends);
    else handleActiveFriends(activeFriends);

    return () => {
      socket.off("STATUS", _callback$Status);
      socket.off("INCOMINGMESSAGE", _callback$IncomingMessage);
      socket.off("NEW_FRIEND", NewFriend);
    };
  }, [
    NewFriend,
    _callback$IncomingMessage,
    _callback$Status,
    activeFriends,
    handleActiveFriends,
    socket,
  ]);

  return (
    <div className="chats-container chat-board" ref={chatBoard}>
      <div className="chat-wrapper">
        <div className="chats-header">
          <div className="title">Chats</div>
        </div>
        <div className="chats-body">
          {loading ? (
            <>
              <div className="loader">
                <CircularProgress sx={{ color: "grey" }} />
              </div>
            </>
          ) : (
            <>
              <Friends friendId={user._id} friends={friends} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBoard;
