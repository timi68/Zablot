/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { AppContext, ModalContext } from "../../../lib/context";
import { v4 as uuid } from "uuid";
import j from "jquery";
import GroupNotification from "../../../utils/GroupNotifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { CSSTransition } from "react-transition-group";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import * as Interfaces from "../../../lib/interfaces";

function Notifications() {
  const {
    state: { socket, user },
  } = React.useContext(AppContext);

  const [openModal, setOpenModal] = React.useState(false);
  const [notifications, setNotifications] = React.useState<
    Interfaces.Notifications[0][]
  >(user?.Notifications || []);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const IconButtonRef = React.useRef<HTMLButtonElement>(null);
  const Backdrop = React.useRef<HTMLDivElement>(null);

  const closemodal = () => {
    setOpenModal(false);
    IconButtonRef.current.classList.remove("active");
  };

  const handleOpen = () => {
    IconButtonRef.current.classList.toggle("active");
    setOpenModal(true);
  };

  const CaptureClick = (e: React.MouseEvent) => {
    var target = e.target === Backdrop.current;
    if (target) closemodal();
  };

  React.useEffect(() => {
    const UpdateNotification = (data: {
      Description: string;
      Name: string;
      title: string;
    }) => {
      console.log(data);
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

  console.log("mounting from notification");
  return (
    <div className="notifications-wrapper">
      <Badge color="default" badgeContent={0} showZero>
        <IconButton className="open" ref={IconButtonRef} onClick={handleOpen}>
          <NotificationsActiveIcon fontSize="small" />
        </IconButton>
      </Badge>
      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="notifications-backdrop"
            ref={Backdrop}
            onClick={CaptureClick}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7, visibility: "hidden" }}
              className="notifications-box"
            >
              <div className="notifications-header">
                <div className="title">Notifications</div>
                <motion.button
                  className="close-modal modal"
                  onClick={closemodal}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

export default Notifications;
