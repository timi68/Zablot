import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import j from "jquery";
import { v4 as uuid } from "uuid";
import MatchedUser from "./MatchedUser";
import * as Interfaces from "@lib/interfaces";
import SearchIcon from "@mui/icons-material/Search";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useAppSelector } from "@lib/redux/store";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";

interface SearchInterface {
  matched: Interfaces.Matched[];
  message?: string;
  pending: string[];
}

const SearchBar = () => {
  const { socket, user, device } = useAppSelector(
    (state) => state.sessionStore
  );
  const [searchData, setSearchData] = React.useState<SearchInterface>({
    matched: [],
    pending: [],
    message: "Waiting to search",
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [friends, setFriends] = React.useState<Interfaces.Friend[]>([]);

  const searchBar = React.useRef<HTMLInputElement>(null);
  const searchIcon = React.useRef<HTMLDivElement>(null);
  const Backdrop = React.useRef<HTMLDivElement>(null);
  const container = React.useRef<HTMLDivElement>(null);

  const ReadyForSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!j(e.target).val()) return j(searchIcon.current).removeClass("ready");
    return searchIcon.current.classList.add("ready");
  };

  const Search = async (e: any) => {
    e.preventDefault();
    try {
      const searchText: string = j(searchBar.current).val() as string;
      if (searchText != "") {
        setLoading(true);
        const data = { searchText, id: user._id };

        const response = await axios.post<Interfaces.Matched[]>(
          "/api/search",
          data
        );

        let matched = response.data;
        if (matched?.length) {
          console.log({ matched, friends });
          const friendsId = friends.map(({ Id }) => Id);
          matched = matched.filter((matchedUser) => {
            if (user._id != matchedUser._id) {
              if (searchData.pending.includes(matchedUser._id))
                matchedUser.sent = true;
              else if (friendsId.includes(matchedUser._id))
                matchedUser.friends = true;
              return matchedUser;
            }
          });
          if (matched?.length) setSearchData({ ...searchData, matched });
          else {
            setSearchData({
              ...searchData,
              matched,
              message: "No user matched your search",
            });
          }
          setLoading(false);
        } else
          setSearchData(() => ({
            ...searchData,
            matched: [],
            message: "No user matched your search",
          }));
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function processAdd(id: string) {
    const newRequest = {
      Info: {
        Name: user.FullName,
        UserName: user.UserName,
        From: user._id,
        Image: "",
      },
      To: id,
    };

    axios.post("/api/socket/friend-request", newRequest).then((response) => {
      setSearchData((state) => {
        let pending = [];
        let newMatched = state.matched.map((user) => {
          if (user._id === id) pending.push(id);
          return { ...user, sent: user._id === id };
        });
        return { ...searchData, matched: newMatched, pending };
      });
    });
  }

  function processFriend(id: string) {
    setOpen(false);
    emitCustomEvent("openRoomById", id);
  }

  // Function that runs when user cancelled the request
  // he/she had sent and delivered or on delivery
  function processCancel(to: string) {
    const data = { from: user._id, to };
    socket.emit("CANCEL_REQUEST", data, (err: string) => {
      if (!err) {
        setSearchData((state) => {
          let matched = state.matched.map((user) => {
            if (user._id === to) delete user.sent;
            return user;
          });

          let pending = state.pending.filter((id) => id !== to);
          return { matched, pending };
        });
      } else console.log(err);
    });
  }

  // Getting the type of notification coming in,
  // if it is request rejected type, list of sent request will
  // be checked and the one rejected among them will be updated
  // instantly, this only vital for request sent and rejected
  // immediately
  const Notification = React.useCallback(
    (data: { Id: string; type: string }) => {
      if (searchData.matched?.length && data.type === "reject") {
        setSearchData((state) => {
          let searchUpdate = state.matched.map((m) => {
            if (m._id === data.Id) {
              delete m.sent, delete m.friends;
              m.rejected = true;
            }
            return m;
          });
          let pending = state.pending.filter((id) => id !== data.Id);
          return { matched: searchUpdate, pending };
        });
      }
    },
    [searchData]
  );

  const NewFriend = React.useCallback((friend: Interfaces.Friend) => {
    setFriends((friends) => [...friends, friend]);
    setSearchData(({ message, matched, pending }) => {
      return {
        message,
        matched: matched?.length
          ? matched.map((user) => {
              return {
                ...user,
                friends: user._id === friend.Id,
              };
            })
          : matched,
        pending: pending.filter((id) => id !== friend.Id),
      };
    });
  }, []);

  const CaptureClick = React.useCallback(
    (e: React.MouseEvent) => {
      var target = e.target === Backdrop.current;
      if (target) setOpen(!open);
    },
    [open]
  );

  React.useEffect(() => {
    if (socket) {
      socket.on("Notifications", Notification);
      socket.on("NEW_FRIEND", NewFriend);

      return () => {
        socket.off("Notifications", Notification);
        socket.off("NEW_FRIEND", NewFriend);
      };
    }
  }, [NewFriend, Notification, socket]);

  React.useEffect(() => {
    if (user) {
      setFriends(user.Friends);
      setSearchData({
        matched: [],
        pending: user.PendingRequests,
        message: "Waiting to search",
      });
    }
  }, [user]);

  // New Friend Event Listener
  useCustomEventListener("newFriend", NewFriend, [friends, searchData]);
  useCustomEventListener(
    "toggle",
    (dest: string) => {
      setOpen(dest == "s");
    },
    [searchBar]
  );

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchBar.current?.focus();
      }, 200);
    }
  }, [open]);

  const isNotDesktop = ["mobile"].includes(device);
  const M = isNotDesktop ? "div" : motion.div;
  const MProp = isNotDesktop
    ? {
        className:
          "!fixed !top-0 !left-0 z-50 !h-screen search-results fetched matched !w-screen rounded-none",
      }
    : {
        initial: { scale: 0.8 },
        animate: { scale: 1 },
        exit: { scale: 0.7 },
      };

  const B = isNotDesktop ? React.Fragment : motion.div;
  const BProp = isNotDesktop
    ? {}
    : {
        onClickCapture: CaptureClick,
        initial: { opacity: 0.8 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "search-backdrop",
        ref: Backdrop,
      };

  const A = isNotDesktop ? React.Fragment : AnimatePresence;
  const AProp = isNotDesktop ? {} : { exitBeforeEnter: true, initial: false };

  return (
    <A {...AProp}>
      {open && (
        <div className="search-container" ref={container}>
          <B {...BProp}>
            <M className="search-results fetched matched" {...MProp}>
              <div className="search-matched-wrapper">
                <motion.div
                  initial={{ scale: 0.7 }}
                  animate={{
                    scale: 1,
                    transitionDuration: ".2s",
                  }}
                  className="header"
                >
                  <div
                    className="search-text-box"
                    id="search"
                    style={{ flexGrow: 1 }}
                  >
                    <form action="#" className="search-form" onSubmit={Search}>
                      <div
                        className="search-icon"
                        ref={searchIcon}
                        onClick={Search}
                        role="search"
                      >
                        <SearchIcon fontSize="small" />
                      </div>
                      <div className="form-control">
                        <input
                          type="search"
                          role="searchbox"
                          aria-autocomplete="none"
                          ref={searchBar}
                          onChange={ReadyForSearch}
                          className="text-control text-sm p-0 font-normal"
                          id="text-control"
                          placeholder="Search a friend.."
                          autoComplete="off"
                        />
                      </div>
                    </form>
                  </div>
                  <motion.button
                    className="close-btn modal"
                    onClick={() => {
                      setOpen(!open);
                      setSearchData({
                        ...searchData,
                        matched: [],
                        message: "Waiting to search",
                      });
                    }}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "rgb(53,163,180)",
                      color: "rgb(255,255,255)",
                    }}
                  >
                    <span>Close</span>
                  </motion.button>
                </motion.div>
                <div className="list-wrapper">
                  <div className="title">
                    <div className="text">Matched Results</div>
                  </div>
                  {!loading && Boolean(searchData.matched?.length) && (
                    <ul className="matched users">
                      {searchData.matched?.map((user) => {
                        var key = uuid();
                        return (
                          <MatchedUser
                            key={key}
                            processFriend={processFriend}
                            processAdd={processAdd}
                            processCancel={processCancel}
                            user={user}
                          />
                        );
                      })}
                    </ul>
                  )}
                  {!loading && !Boolean(searchData.matched?.length) && (
                    <div className="search-message">
                      <h5 className="text">{searchData?.message}</h5>
                    </div>
                  )}
                  {loading && (
                    <div className="search-loader">
                      <CircularProgress />
                    </div>
                  )}
                </div>
              </div>
            </M>
          </B>
        </div>
      )}
    </A>
  );
};

export default React.memo(SearchBar);
