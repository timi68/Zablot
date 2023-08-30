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
import SearchIcon from "@mui/icons-material/Search";
import Backdrop from "@comp/Backdrop";
import { variants } from "@lib/constants";
import { notification } from "antd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const ChatBoard: React.FC = function () {
  const { user, activeFriends, socket, device } = useAppSelector(
    (s) => s.sessionStore
  );
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [friends, setFriends] = React.useState<Interface.Friend[]>([]);
  const [loading, setLoading] = React.useState(!Boolean(activeFriends));
  const chatBoard = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<{ unMount: Function }>(null);

  const cleanSeen = React.useCallback(
    (id: string) => {
      socket?.emit(
        "CLEAN_SEEN",
        { _id: user?._id, id: id },
        (err: string, done: string) => {
          if (err) {
            alert("Internal server error: restarting window now");
          }
        }
      );
    },
    [socket]
  );

  const NewFriend = React.useCallback((friend: Interface.Friend) => {
    setFriends((friends) =>
      [friend, ...friends].sort((a, b) => a.time - b.time)
    );

    notification.open({
      icon: <PersonAddIcon fontSize="small" />,
      message: <div className="title font-bold">A New Friend</div>,
      description: (
        <span>
          <b className="text-green">{friend.name}</b> is asking to be your
          friend`
        </span>
      ),
      className:
        "rounded-xl shadow-lg border border-solid border-green/30 bg-[#daedf0] [&_*]:font-['Nunito']",
      placement: "bottomLeft",
      onClick: () => {
        emitCustomEvent("openRoom", { friend });
        notification.destroy();
      },
    });
  }, []);

  const _callback$IncomingMessage = React.useCallback(
    (data: Interface.MessageType) => {
      const roomIds = store.getState().rooms.ids;
      setFriends((state) => {
        const oldState = state.filter((user) => user.id !== data.coming);
        let user = state.find((f) => f.id === data.coming) as Zablot.Friend;
        user = {
          ...user,
          time: data.date,
          unseenMessages: roomIds.includes(data.coming)
            ? 0
            : Number(user?.unseenMessages) + 1,
          lastMessage: data.message,
          lastPersonToSendMessage: data.coming,
        };
        oldState.unshift(user!);

        return oldState;
      });

      if (roomIds.includes(data.coming)) cleanSeen(data._id);
    },
    [socket, cleanSeen]
  );

  const _callback$Status = React.useCallback(
    (data: { online: boolean; _id: string }) => {
      setFriends((state) => {
        const newState = state.map((user) => {
          if (user.id === data._id) {
            return { ...user, active: data.online };
          }
          return user;
        });

        return newState;
      });
    },
    []
  );

  const handleActiveFriends = React.useCallback(
    (actives: string[]) => {
      setFriends((state) => {
        state = state.map((user) => {
          const _id = user.id.slice(19, 24);
          return { ...user, active: actives.includes(_id) };
        });

        return state;
      });
      setLoading(false);
      dispatch(ACTIVE_FRIENDS(actives));
    },
    [dispatch]
  );

  useCustomEventListener(
    "openRoom",
    ({ friend }: { friend: Zablot.Friend }) => {
      if (friend.unseenMessages == 0) return;
      setFriends((state) => {
        state = state.map((u) => {
          if (u.id === friend.id) {
            return { ...u, unseenMessages: 0 };
          }
          return u;
        });
        return state.sort((a, b) => a.time - b.time);
      });
      cleanSeen(friend._id);
    }
  );

  useCustomEventListener(
    "Message",
    (data: { id: string; message: string; flow: string; time: number }) => {
      setFriends((prevFriends) => {
        return prevFriends
          .map((friend) => {
            if (friend.id === data.id) {
              return {
                ...friend,
                time: data.time,
                lastMessage: data.message,
                lastPersonToSendMessage: data.flow,
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

  // React.useEffect(() => {
  //   if (user) setFriends([...user.friends].sort((a, b) => a.time - b.time));
  // }, [user]);

  // React.useEffect(() => {
  //   if (user) setFriends(user.friends);
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

  // const CaptureClick = (e: React.MouseEvent) => {
  //   setOpenModal(false), emitCustomEvent("off");
  // };

  const isNotDesktop = ["mobile"].includes(device);
  const MProp = isNotDesktop
    ? {
        className:
          "!fixed !top-0 !left-0 z-50 chats-container h-screen w-screen",
      }
    : variants;

  return (
    openModal && (
      <Backdrop open={setOpenModal}>
        <motion.div className="chats-container" {...MProp} ref={chatBoard}>
          <div className="chats-wrapper relative z-50">
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
                  <Friends friendId={user!._id} friends={friends} />
                </>
              )}
            </div>
          </div>
        </motion.div>
      </Backdrop>
    )
  );
};

export default ChatBoard;
