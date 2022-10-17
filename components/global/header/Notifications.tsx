/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { v4 as uuid } from "uuid";
import j from "jquery";
import GroupNotification from "../../../utils/GroupNotifications";
import { CSSTransition } from "react-transition-group";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import * as Interfaces from "@lib/interfaces";
import { useAppSelector } from "@lib/redux/store";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";

function Notifications() {
  const { socket, user, device } = useAppSelector((s) => s.sessionStore);
  const [openModal, setOpenModal] = React.useState(false);
  const [notifications, setNotifications] = React.useState<
    Interfaces.Notifications[0][]
  >(user?.Notifications || []);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const Backdrop = React.useRef<HTMLDivElement>(null);

  useCustomEventListener("toggle", (dest: string) => {
    setOpenModal(dest == "n");
  });

  const CaptureClick = (e: React.MouseEvent) => {
    e.target === Backdrop.current &&
      (setOpenModal(false), emitCustomEvent("off"));
  };

  React.useEffect(() => {
    if (user) {
      setNotifications(user.Notifications);
    }
  }, [user]);

  React.useEffect(() => {
    const UpdateNotification = (data: {
      Description: string;
      Name: string;
      title: string;
    }) => {
      setNotifications([data, ...notifications]);
      enqueueSnackbar(data.title, {
        variant: "info",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
      });
    };

    if (socket) {
      socket.on("Notifications", UpdateNotification);
    }

    return () => {
      socket?.off("Notifications", UpdateNotification);
    };
  }, [socket]);

  const isNotDesktop = ["mobile"].includes(device);
  const M = isNotDesktop ? "div" : motion.div;
  const MProp = isNotDesktop
    ? {
        className:
          "!fixed !top-0 !left-0 z-50 h-screen notifications-wrapper w-screen",
      }
    : {
        initial: { scale: 0.8 },
        animate: { scale: 1 },
        exit: { scale: 0.7 },
      };

  const A = isNotDesktop ? React.Fragment : AnimatePresence;
  const AProp = isNotDesktop ? {} : { exitBeforeEnter: true, initial: false };

  return (
    <A {...AProp}>
      {openModal && (
        <>
          <div
            className="backdrop w-screen h-screen z-50 top-0 left-0 opacity-0 fixed"
            ref={Backdrop}
            onClick={CaptureClick}
          />
          <M className="notifications-wrapper" {...MProp}>
            <div className="notifications-header">
              <div className="title font-bold">Notifications</div>
              <motion.button
                className="close-modal modal"
                onClick={() => (setOpenModal(false), emitCustomEvent("off"))}
                whileTap={{ scale: 0.9 }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgb(53,163,180)",
                  color: "rgb(255,255,255)",
                }}
              >
                <span>Close</span>
              </motion.button>
            </div>
            <div className="notifications-body">
              <div className="current">
                {notifications?.length ? (
                  <div className="notifications-list">
                    {notifications.map((data, i) => {
                      var current = notifications[i].Date;
                      var previous = i > 0 ? notifications[i - 1].Date : "";

                      var key = uuid();
                      return (
                        <NotificationsPaper
                          key={key}
                          data={data}
                          current={current}
                          previous={previous}
                          index={i}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty_notification">
                    <div className="empty-text">
                      <p className="text">No Notification Available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </M>
        </>
      )}
    </A>
  );
}

function NotificationsPaper(props) {
  const { data, current, previous, index } = props;
  return (
    <React.Fragment>
      <GroupNotification cur={current} pre={previous} i={index} />
      <li className="notification">
        <div className="notification-image">
          <div className="image">
            <img
              className="avatar w-10 h-10 rounded-full"
              src="./images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
              alt=""
            />
          </div>
        </div>
        <div className="notification-body">
          <div className="notification-name title">
            <div className="notification-text text">
              <span
                dangerouslySetInnerHTML={{
                  __html: data.Description,
                }}
              ></span>
              <br />
              <span className="from">
                <b>From {data.Name}</b>
              </span>
            </div>
          </div>
        </div>
      </li>
    </React.Fragment>
  );
}

export default React.memo(Notifications);
