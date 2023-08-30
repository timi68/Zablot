/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { v4 as uuid } from "uuid";
import GroupNotification from "../../../utils/GroupNotifications";
import { motion } from "framer-motion";
import { useSnackbar } from "notistack";
import * as Interfaces from "@lib/interfaces";
import { useAppSelector } from "@lib/redux/store";
import { useCustomEventListener } from "react-custom-events";
import { variants } from "@lib/constants";
import Backdrop from "@comp/Backdrop";
import CloseButton from "@comp/CloseButton";

function Notifications() {
  const { socket, user, device } = useAppSelector((s) => s.sessionStore);
  const [openModal, setOpenModal] = React.useState(false);
  const [notifications, setNotifications] = React.useState<
    Zablot.Notification[]
  >(user?.notifications || []);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const backdropRef = React.useRef<{ unMount: Function }>(null);

  useCustomEventListener("toggle", (dest: string) => {
    setOpenModal(dest == "n");
  });

  React.useEffect(() => {
    if (user) {
      setNotifications(user.notifications);
    }
  }, [user]);

  // React.useEffect(() => {
  //   const UpdateNotification = (data: {
  //     description: string;
  //     name: string;
  //     title: string;
  //   }) => {
  //     setNotifications([data, ...notifications]);
  //     enqueueSnackbar(data.title, {
  //       variant: "info",
  //       anchorOrigin: {
  //         vertical: "bottom",
  //         horizontal: "left",
  //       },
  //     });
  //   };

  //   if (socket) {
  //     socket.on("notifications", UpdateNotification);
  //   }

  //   return () => {
  //     socket?.off("notifications", UpdateNotification);
  //   };
  // }, [socket]);

  const isNotDesktop = ["mobile"].includes(device);
  const M = isNotDesktop ? "div" : motion.div;
  const MProp = isNotDesktop
    ? {
        className:
          "!fixed !top-0 !left-0 z-50 h-screen notifications-wrapper w-screen",
      }
    : variants;

  return (
    openModal && (
      <Backdrop open={setOpenModal} ref={backdropRef}>
        <M className="notifications-wrapper" {...MProp}>
          <div className="notifications-header">
            <div className="title font-bold">Notifications</div>
            <CloseButton close={() => backdropRef.current?.unMount()} />
          </div>
          <div className="notifications-body">
            <div className="current">
              {notifications?.length ? (
                <div className="notifications-list">
                  {notifications.map((data, i) => {
                    var current = notifications[i].createdAt;
                    var previous = i > 0 ? notifications[i - 1].createdAt : "";

                    var key = uuid();
                    return (
                      <NotificationsPaper
                        key={key}
                        data={data}
                        current={current as string}
                        previous={previous as string}
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
      </Backdrop>
    )
  );
}

interface NotificationPaperProps {
  current: string;
  previous: string;
  index: number;
  data: Interfaces.Notification;
}
function NotificationsPaper(props: NotificationPaperProps) {
  const { data, current, previous, index } = props;
  return (
    <React.Fragment>
      <GroupNotification
        cur={new Date(current)}
        pre={new Date(previous)}
        i={index}
      />
      <li className="notification">
        <div className="notification-image">
          <div className="image">
            <img
              className="avatar w-10 h-10 rounded-full"
              src="/images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
              alt=""
            />
          </div>
        </div>
        <div className="notification-body">
          <div className="notification-name title">
            <div className="notification-text text">
              <span
                dangerouslySetInnerHTML={{
                  __html: data.description as string,
                }}
              ></span>
              <br />
              <span className="from">
                <b>From {data.name}</b>
              </span>
            </div>
          </div>
        </div>
      </li>
    </React.Fragment>
  );
}

export default React.memo(Notifications);
