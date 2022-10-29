import Image from "next/image";
import React from "react";
import { CircularProgress, IconButton } from "@mui/material";
import * as Interface from "@lib/interfaces";
import Friends from "./Friends";
import j from "jquery";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import store, { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { ACTIVE_FRIENDS } from "@lib/redux/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import ArrowBack from "@mui/icons-material/ArrowBackIos";
import SearchIcon from "@mui/icons-material/Search";

const ChatBoard: React.FC = function () {
  const { user, activeFriends, socket, device } = useAppSelector(
    (s) => s.sessionStore
  );
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [friends, setFriends] = React.useState<Interface.Friend[]>([]);
  const [loading, setLoading] = React.useState(!Boolean(activeFriends));
  const chatBoard = React.useRef<HTMLDivElement>(null);
  const Backdrop = React.useRef<HTMLDivElement>(null);

  const NewFriend = React.useCallback((data: Interface.Friend) => {
    setFriends((friends) => [data, ...friends].sort((a, b) => a.time - b.time));
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
        return state.sort((a, b) => a.time - b.time);
      });
      CleanSeen(friend._id);
    }
  );

  useCustomEventListener(
    "Message",
    (data: { id: string; message: string; flow: string; time: number }) => {
      setFriends((prevFriends) => {
        return prevFriends
          .map((friend) => {
            if (friend.Id === data.id) {
              return {
                ...friend,
                time: data.time,
                Last_Message: data.message,
                LastPersonToSendMessage: data.flow,
              };
            }
            return friend;
          })
          .sort((a, b) => a.time - b.time);
      });
    },
    []
  );

  useCustomEventListener(
    "newFriend",
    (friend: Interface.Friend) => {
      setFriends([friend, ...friends].sort((a, b) => a.time - b.time));
    },
    [friends]
  );

  useCustomEventListener(
    "toggle",
    (dest: string) => {
      setOpenModal(dest == "c");
    },
    [device]
  );

  React.useEffect(() => {
    if (user) setFriends([...user.Friends].sort((a, b) => a.time - b.time));
  }, [user]);

  // React.useEffect(() => {
  //   if (user) setFriends(user.Friends);
  // }, [device]);

  React.useEffect(() => {
    if (socket) {
      socket.on("STATUS", _callback$Status);
      socket.on("INCOMINGMESSAGE", _callback$IncomingMessage);
      socket.on("NEW_FRIEND", NewFriend);

      if (!activeFriends) socket.emit("ACTIVE_USERS", handleActiveFriends);
      else handleActiveFriends(activeFriends);
    }

    return () => {
      socket?.off("STATUS", _callback$Status);
      socket?.off("INCOMINGMESSAGE", _callback$IncomingMessage);
      socket?.off("NEW_FRIEND", NewFriend);
    };
  }, [
    NewFriend,
    _callback$IncomingMessage,
    _callback$Status,
    activeFriends,
    handleActiveFriends,
    socket,
  ]);

  const CaptureClick = (e: React.MouseEvent) => {
    e.target === Backdrop.current &&
      (setOpenModal(false), emitCustomEvent("off"));
  };

  const isNotDesktop = ["mobile"].includes(device);
  const M = motion.div;
  const MProp = isNotDesktop
    ? {
        className:
          "!fixed !top-0 !left-0 z-50 chats-container h-screen w-screen",
        initial: { x: 100 },
        animate: { x: 0 },
        exit: { x: 600 },
      }
    : {
        initial: { scale: 0.8 },
        animate: { scale: 1 },
        exit: { scale: 0.7, opacity: 0 },
        className: "chats-container",
      };

  const A = AnimatePresence;

  return (
    <A>
      {openModal && (
        <>
          <div
            className="h-screen fixed w-screen top-0 left-0 z-30"
            ref={Backdrop}
            onClickCapture={CaptureClick}
          />
          <M {...MProp} ref={chatBoard}>
            <div className="chats-wrapper">
              <div className="chats-header flex items-center gap-1 flex-nowrap">
                <div className="text-lg font-bold flex-grow">Chats</div>
                <div className="ml-3 search-container " id="search">
                  <div className="border border-solid h-[35px] w-[35px] justify-center border-gray-500 rounded-3xl flex items-center">
                    <SearchIcon
                      fontSize="small"
                      className="search-icon h-6 w-6"
                    />
                    {/* <div className="form-control flex-grow">
                      <input
                        type="search"
                        role="searchbox"
                        aria-autocomplete="none"
                        className="text-control bg-transparent text-sm p-2 "
                        id="text-control"
                        placeholder="Search a friend.."
                        autoComplete="off"
                      />
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="chats-body p-3">
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
          </M>
        </>
      )}
    </A>
  );
};

export default ChatBoard;
