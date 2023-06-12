/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CSSTransition } from "react-transition-group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { IconButton, Badge, Button, Avatar } from "@mui/material";
import j from "jquery";
import * as Interfaces from "@lib/interfaces";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import { useAppSelector } from "@lib/redux/store";
import { formatDistanceToNowStrict } from "date-fns";
import stringToColor from "@utils/stringToColor";
import { useRouter } from "next/router";
import Backdrop from "@comp/Backdrop";
import { variants } from "@lib/constants";
import CloseButton from "@comp/CloseButton";
import PeopleYouMightKnow from "./PeopleYouMayKnow";
import Request from "./Request";
import { notification } from "antd";
import { useDispatch } from "react-redux";
import { USER } from "@lib/redux/userSlice";

const FriendRequests = () => {
  const { socket, user, device } = useAppSelector(
    (state) => state.sessionStore
  );
  const [requests, setRequests] = useState<Partial<Interfaces.Requests[]>>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const IconButtonRef = useRef<HTMLButtonElement>(null);
  const backdropRef = React.useRef<{ unMount: Function }>(null);
  const [friends, setFriends] = React.useState([]);
  const router = useRouter();
  const dispatch = useDispatch();

  // React.useEffect(() => {
  //   if (router.asPath.indexOf("friend-request") != -1) {
  //     setOpenModal(true);
  //   } else {
  //     setOpenModal(false);
  //   }
  // }, [router]);

  const Reject = (id: string) => {
    let data = {
      going_id: id,
      coming_id: user._id,
      coming_name: user?.FullName,
      coming_image: user?.Image.profile,
    };
    socket.emit("REJECT_REQUEST", data, (err: string, done: string) => {
      setRequests((state) => {
        return (state = state.map((req) => {
          if (req.From === id) {
            return { ...req, Rejected: true };
          }
          return req;
        }));
      });

      setTimeout(() => {
        setRequests((state) => {
          return (state = state.filter((req) => req.From !== id));
        });
      }, 5000);
    });
  };

  const Accept = (data: Interfaces.Requests) => {
    const data_to_emit = {
      going_id: data.From,
      going_name: data.Name,
      going_image: data.Image,
      coming_id: user._id,
      coming_name: user?.FullName,
      coming_image: user?.Image.profile,
    };

    socket.emit(
      "ACCEPT_REQUEST",
      data_to_emit,
      (err: string | object, FriendData: Interfaces.Friend) => {
        if (!err) {
          setRequests((state) => {
            return state.map((req) => {
              if (req.From === data.From) {
                return { ...req, Accepted: true };
              }
              return req;
            });
          });

          let newFriend = {
            ...FriendData,
            Id: data.From,
            Name: data.Name,
            Image: data.Image,
            isComing: false,
          };

          setFriends([newFriend, ...friends]);
          emitCustomEvent("newFriend", newFriend);
        } else {
          let reload = confirm(
            "There is an error processing new friend request. Would you like to reload the page?."
          );
          if (reload) location.reload();
        }
      }
    );
  };

  const Message = (user: string) => {
    setOpenModal(false);
    let friend = friends.find((f) => f.Id === user);
    if (friend) {
      emitCustomEvent("openRoom", { friend });
    }
  };

  const FRIENDSHIP_DEMAND = (data: Interfaces.Requests) => {
    const newRequest: Interfaces.Requests = {
      From: data.From,
      Name: data.Name,
      UserName: data.UserName,
      Image: data.Image,
      Date: new Date(),
    };

    // Incase the friend_request coming in has been process b4, let's send response immediately
    // let isFriend =
    //   friends.findIndex((friend) => friend.Id === data.From) !== -1;
    // if (isFriend) {
    //   Accept(newRequest);
    //   return;
    // }
    // Check if new request is already existing and add new or removing any existing one
    let newFriendsRequest = [
      newRequest,
      ...requests.filter((r) => r.From !== data.From),
    ];

    setRequests(newFriendsRequest);
    dispatch(USER({ ...user, FriendRequests: newFriendsRequest }));

    notification.open({
      icon: <PersonAddIcon fontSize="small" />,
      message: <div className="title font-bold">New Friend Request</div>,
      description: (
        <span>
          <b className="text-green">{newRequest.Name}</b> is asking to be your
          friend`
        </span>
      ),
      className:
        "rounded-xl shadow-lg border border-solid border-green/30 bg-[#daedf0] [&_*]:font-['Nunito']",
      placement: "bottomLeft",
    });
  };

  const REMOVE_REQUEST = (data: { from: string }) => {
    setRequests((state) => {
      return (state = state.filter((user) => user.From !== data.from));
    });
  };

  React.useEffect(() => {
    if (socket) {
      socket.on("FRIENDSHIP_DEMAND", FRIENDSHIP_DEMAND);
      socket.on("REMOVE_REQUEST", REMOVE_REQUEST);
    }

    return () => {
      socket?.off("REMOVE_REQUEST", REMOVE_REQUEST);
      socket?.off("FRIENDSHIP_DEMAND", FRIENDSHIP_DEMAND);
    };
  }, [socket]);

  useEffect(() => {
    if (user) {
      setRequests([...user.FriendRequests].reverse());
      setFriends(user.Friends);
    }
  }, [user]);

  React.useEffect(() => {
    if (user) {
      let newFriendRequests = requests.filter((r) => !r.Accepted);
      dispatch(USER({ ...user, FriendRequests: newFriendRequests.reverse() }));
    }
  }, [openModal]);

  const closeModal = () => {
    backdropRef.current?.unMount();
    setRequests(requests.filter((r) => !r.Accepted));
  };

  useCustomEventListener("toggle", (dest: string) => {
    setOpenModal(dest == "f");
  });

  const isNotDesktop = ["mobile"].includes(device);
  const M = isNotDesktop ? "div" : motion.div;
  const MProp = isNotDesktop
    ? {
        className:
          "!fixed !top-0 !left-0 z-50 h-screen friend-requests-wrapper w-screen",
      }
    : variants;

  return (
    openModal && (
      <Backdrop open={setOpenModal} ref={backdropRef}>
        <M className="friend-requests-wrapper" {...MProp}>
          <div className="requests-header transition-all top-0 shadow-lg sticky flex justify-between bg-inherit py-2.5 px-5">
            <div className="title">Friend Requests</div>
            <CloseButton close={closeModal} />
          </div>
          <div className="requests-list">
            <ul className="users">
              {requests?.map((friend, index) => {
                var duration = formatDistanceToNowStrict(new Date(friend.Date));

                return (
                  <Request
                    key={index}
                    accept={Accept}
                    reject={Reject}
                    message={Message}
                    friend={friend}
                    duration={duration}
                  />
                );
              })}
              {!Boolean(requests?.length) && (
                <div className="no_request !text-sm">
                  <h6>There is no request available</h6>
                </div>
              )}
            </ul>
          </div>
          <PeopleYouMightKnow />
        </M>
      </Backdrop>
    )
  );
};

export default React.memo(FriendRequests);
