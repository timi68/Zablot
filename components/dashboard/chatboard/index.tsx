import Image from "next/image";
import React from "react";
import { ModalContext } from "@lib/context";
import { CircularProgress } from "@mui/material";
import * as Interface from "@lib/interfaces";
import Friends from "./Friends";
import j from "jquery";
import { useCustomEventListener } from "react-custom-events";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { ACTIVE_FRIENDS } from "@lib/redux/userSlice";

const ChatBoard: React.FC = function () {
  const { user, activeFriends, socket } = useAppSelector((s) => s.sessionStore);
  const dispatch = useAppDispatch();
  const modalSignal = React.useContext(ModalContext);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [friends, setFriends] = React.useState<Interface.Friend[]>([]);
  const [loading, setLoading] = React.useState(!Boolean(activeFriends));
  const chatBoard = React.useRef<HTMLDivElement>(null);

  const NewFriend = React.useCallback((data: Interface.Friend) => {
    setFriends((friends) => [data, ...friends]);
  }, []);

  const _callback$IncomingMessage = React.useCallback(
    (data: Interface.MessageType) => {
      const id = [];
      j(".chats-form").each((i: number, e: HTMLDivElement) => {
        id.push(j(e).attr("id").slice(4, 12));
      });

      setFriends((state) => {
        const oldState = state.filter((user) => user.Id !== data.coming);
        state.map((user) => {
          if (user.Id === data.coming) {
            user.UnseenMessages = id.includes(data._id)
              ? 0
              : Number(user.UnseenMessages) + 1;
            user.Last_Message = data.message;
            user.LastPersonToSendMessage = data.coming;
            oldState.unshift(user);
          }
          return;
        });

        return oldState;
      });
    },
    []
  );

  const _callback$Status = React.useCallback((data) => {
    setFriends((state) => {
      const newState = state.map((user) => {
        if (user.Id === data._id) user.active = data.online;
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

  const openChatBoard = React.useCallback(
    (click?: boolean) => {
      const innerWidth = window.innerWidth < 830;

      if (!innerWidth) return;

      if (!openModal) j(modalSignal?.current).trigger("click").addClass("show");
      else j(modalSignal?.current).removeClass("show");

      if (click) j(modalSignal?.current).trigger("click");
      else chatBoard.current.classList.toggle("show");
    },
    [modalSignal, openModal]
  );

  useCustomEventListener(
    "openRoom",
    ({ user: _u }: { user: Interface.Friend }) => {
      openChatBoard(true);
      setFriends((state) => {
        state = state.map((u) => {
          if (u.Id === _u.Id) {
            return { ...u, UnseenMessages: 0 };
          }
          return u;
        });
        return state;
      });

      socket.emit(
        "CLEAN_SEEN",
        { _id: user._id, Id: _u._id },
        (err: string, done: string) => {
          if (err) {
            alert("Internal server error: restarting window now");
          }
        }
      );
    }
  );

  useCustomEventListener(
    "Message",
    (data: { id: string; message: string; flow: string }) => {
      setFriends((prevFriends) => {
        return prevFriends.map((friend) => {
          if (friend.Id === data.id) {
            friend.Last_Message = data.message;
            friend.LastPersonToSendMessage = data.flow;
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
