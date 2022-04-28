import Image from "next/image";
import React from "react";
import { AppContext, ModalContext } from "../../../lib/context";
import { motion } from "framer-motion";
import SecurityIcon from "@mui/icons-material/Security";
import { CircularProgress } from "@mui/material";
import * as Interface from "../../../lib/interfaces";
import Friends from "./Friends";
import PrivateFriends from "./PrivateFriends";
import Navbar from "./Navbar";
import j from "jquery";

interface ChatBoardType {
  chatRoom: {
    current: {
      OpenRoom(user: Interface.Friends, target: HTMLElement): void;
    };
  };
}
const ChatBoard = React.forwardRef(function (props: ChatBoardType, ref) {
  const {
    state: { socket, session, user, activeFriends },
    dispatch,
  } = React.useContext(AppContext);
  const modalSignal = React.useContext(ModalContext);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [friends, setFriends] = React.useState<Interface.Friends[]>(
    user?.Friends || []
  );
  const [loading, setLoading] = React.useState(!Boolean(activeFriends));
  const chatBoard = React.useRef<HTMLDivElement>(null);

  const NewFriend = React.useCallback(
    (data: Interface.Friends) => {
      console.log("NewFriends emitted", data);
      setFriends([data, ...friends]);
    },
    [friends]
  );

  const _callback$IncomingMessage = React.useCallback(
    (data: Interface.MessageType) => {
      console.log(" IncomingMessage emitted", data);
      const id = [];
      j(".chats-form").each((i, e) => {
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
    console.log({ data });
    setFriends((state) => {
      const newState = state.map((user) => {
        if (user.Id === data._id) user.active = data.online;
        return user;
      });

      return newState;
    });
  }, []);

  const handleActiveFriends = (actives) => {
    setFriends((state) => {
      state = state.map((user) => {
        const _id = user.Id.slice(19, 24);
        const active = actives.includes(_id);

        if (active) user.active = true;
        else user.active = false;

        return user;
      });

      return state;
    });

    console.log({ friends });
    setLoading(false);
    dispatch({
      type: Interface.ActionType.ACTIVEFRIENDS,
      payload: { activeFriends: actives },
    });
  };

  const handleClick = React.useCallback(() => {
    if (!openModal) return;
    setOpenModal(false);

    console.log("from chatboard");

    modalSignal.current.classList.remove("show");
    chatBoard.current.classList.remove("show");
  }, [modalSignal, openModal]);

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

  const openRoom = (
    userRoom: Interface.Friends,
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ): void => {
    openChatBoard(true);
    setFriends((state) => {
      state = state.map((u) => {
        if (u.Id === userRoom.Id) u.UnseenMessages = 0;
        return u;
      });
      return state;
    });

    socket.emit(
      "CLEANSEEN",
      { _id: user._id, Id: userRoom._id },
      (err: string, done: string) => {
        console.log(err || done);
        if (err) {
          alert("Internal server error: restarting window now");
          location.reload();
        }
      }
    );

    let target = e.target as HTMLElement;
    props.chatRoom.current.OpenRoom(userRoom, target);
    return;
  };

  React.useEffect(() => {
    if (socket) {
      socket.on("STATUS", _callback$Status);
      socket.on("IncomingMessage", _callback$IncomingMessage);
    }

    if (!activeFriends) {
      socket.emit("ACTIVEUSERS", handleActiveFriends);
    } else {
      handleActiveFriends(activeFriends);
    }

    return () => {
      socket.off("STATUS", _callback$Status);
      socket.off("IncomingMessage", _callback$IncomingMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  React.useEffect(() => {
    const modal = modalSignal?.current;
    j(modalSignal?.current).on("click", handleClick);
    return () => {
      j(modal).off("click", handleClick);
    };
  }, [handleClick, modalSignal, openModal]);

  React.useImperativeHandle(
    ref,
    () => ({
      UpdateFriends(friend: Interface.Friends) {
        console.log("Updating friends");
        setFriends((friends) => [friend, ...friends]);
      },
      SetLastMessage(id: string, message: string, flow: string) {
        setFriends((prevFriends) => {
          const currentFriends = prevFriends.map((friend) => {
            if (friend.Id === id) {
              friend.Last_Message = message;
              friend.LastPersonToSendMessage = flow;
            }
            return friend;
          });
          return currentFriends;
        });
      },
      toggle() {
        setOpenModal(!openModal);
        openChatBoard();
      },
    }),
    [openChatBoard, openModal]
  );

  console.log("mounting from chatboard");
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
              <div className="loader">
                <CircularProgress sx={{ color: "grey" }} />
              </div>
            </>
          ) : (
            <>
              <Friends
                friendId={session.id}
                friends={friends}
                openRoom={openRoom}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
});

ChatBoard.displayName = "ChatBoard";

export default ChatBoard;
