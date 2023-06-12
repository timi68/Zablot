/* eslint-disable @next/next/no-img-element */
import React from "react";
import { NextRouter, useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Dashboard from "@mui/icons-material/Dashboard";
import CreateQuiz from "@mui/icons-material/CreateOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ReportIcon from "@mui/icons-material/Report";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import IconButton from "@mui/material/IconButton";
import DynamicFormRoundedIcon from "@mui/icons-material/DynamicFormRounded";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import axios from "axios";
import { useAppSelector } from "@lib/redux/store";
import { Avatar, Skeleton } from "@mui/material";
import stringToColor from "@utils/stringToColor";
import { useCustomEventListener } from "react-custom-events";
import j from "jquery";

type Tooltip = {
  title: string;
  top: number;
  open: boolean;
};

export default React.memo(function Sidebar() {
  const { user, device } = useAppSelector((state) => state.sessionStore);
  const sidebar: React.MutableRefObject<HTMLDivElement> =
    React.useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = React.useState<Tooltip>({
    open: false,
    title: "",
    top: 0,
  });
  const [show, setShow] = React.useState(false);
  const router: NextRouter = useRouter();

  const openSidebar = () => {
    setShow(!show);
  };

  const MouseEnter = (e: React.MouseEvent) => {
    var width = window.innerWidth;

    if (width > 1000) return;

    var title = j(e.target).closest("li").attr("data-title");
    var offsetTop = j(e.target).prop("offsetTop") as number;

    setTooltip({
      open: true,
      title,
      top: offsetTop - j(".navigators").prop("scrollTop"),
    });
  };

  useCustomEventListener("side", openSidebar);

  return (
    <div
      className={
        "navigator max-w-[300px] sidebar " + device + (show ? " show" : "")
      }
      onMouseLeave={() =>
        setTimeout(() => {
          setTooltip({ ...tooltip, open: false });
        }, 200)
      }
      ref={sidebar}
    >
      {device === "mobile" && (
        <IconButton
          size="small"
          className="open absolute rotate-[180deg] right-2 top-5 grid items-center z-[20] p-0 pb-[1px]"
          onClick={openSidebar}
        >
          <ChevronLeftRoundedIcon className="rotate-[180deg] transition-all" />
        </IconButton>
      )}
      {!show && (
        <AnimatePresence mode={"sync"}>
          {tooltip.open && (
            <motion.div
              initial={{ x: -20, enableBackground: "whitesmoke" }}
              animate={{
                x: 0,
                enableBackground: "white",
                color: "#369298",
                radius: "0 10px 10px 0",
              }}
              transition={{ type: "just" }}
              className={`fixed z-[999] text-sm font-semibold shadow-lg w-[130px] h-[40px] left-[60px] bg-white grid items-center`}
              style={{ y: tooltip.top }}
            >
              <span className="title">{tooltip.title}</span>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <motion.div layout={device == "tablet"} className="navigator-wrapper">
        <AnimatePresence>
          {!show && device === "tablet" ? (
            ""
          ) : (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ width: 0, height: 0, spacing: 0 }}
              className="preview-profile"
            >
              <div className="user-image-name-wrapper">
                <div className="user-image">
                  {user ? (
                    <Avatar
                      src={user.Image?.profile}
                      variant="rounded"
                      sx={{
                        width: 30,
                        height: 30,
                        fontSize: "1rem",
                        bgcolor: stringToColor(user.FullName),
                      }}
                    >
                      {user.FullName.split(" ")[0][0] +
                        (user.FullName.split(" ")[1]?.at(0) ?? "")}
                    </Avatar>
                  ) : (
                    <Skeleton className="w-8 h-9" />
                  )}
                </div>
                <div className="name-wrap flex-grow">
                  {user ? (
                    <>
                      <div className="name">{user?.FullName}</div>
                      <div className="username">@{user?.UserName}</div>
                    </>
                  ) : (
                    <>
                      <Skeleton className="w-full h-5" />
                      <Skeleton className="w-9/12 h-5" />
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          <motion.div className="links-container navigators">
            {!show && device === "tablet" ? (
              ""
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ width: 0, height: 0 }}
                className="message-from-zablot"
              >
                <div className="message text-sm mb-4 font-bold">
                  Good Evening Timi!
                </div>
              </motion.div>
            )}
            <div className="group-1 face-1 links-wrapper">
              <ul className="links-list">
                {device == "tablet" && (
                  <IconButton
                    size="small"
                    onClick={openSidebar}
                    style={{ position: show ? "absolute" : "relative" }}
                    className="mb-10 ml-5 top-5 p-0 pt-[1px] right-2 z-20 h-[25px] w-[25px] grid place-items-center bg-white shadow-lg"
                  >
                    <ChevronLeftRoundedIcon
                      fontSize="small"
                      style={{
                        transform: `rotate(${show ? "0deg" : "180deg"})`,
                      }}
                      className="transition-all"
                    />
                  </IconButton>
                )}
                {links.map((data, index) => {
                  return (
                    <motion.li
                      key={index}
                      onClick={() => {
                        setTooltip({ ...tooltip, open: false });
                        setShow(false);
                      }}
                      data-title={data.title}
                      className="link-wrap"
                    >
                      <Link href={data.url} passHref>
                        <span
                          onMouseEnter={MouseEnter}
                          onMouseLeave={() =>
                            setTooltip({ ...tooltip, open: false })
                          }
                          // href="#"
                          className={
                            device +
                            (router.asPath.includes(data.url) ? " active" : "")
                          }
                        >
                          <div className="icon-wrap">
                            <data.icon fontSize="small" className="svg" />
                          </div>
                          {!show && device === "tablet" ? (
                            ""
                          ) : (
                            <motion.div exit={{ width: 0 }} className="link">
                              <div className="link-title">{data.title}</div>
                            </motion.div>
                          )}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
            <div className="group-2 face-2 links-wrapper">
              <ul className="links-list">
                {link2.map((data, index) => {
                  return (
                    <li
                      key={index}
                      onMouseEnter={MouseEnter}
                      onMouseLeave={() =>
                        setTooltip({ ...tooltip, open: false })
                      }
                      data-title={data.title}
                      className="link-wrap"
                    >
                      <Link href={data.url} passHref>
                        <span
                          // href="#"
                          className={
                            device +
                            (router.asPath.includes(data.url) ? " active" : "")
                          }
                        >
                          <div className="icon-wrap">
                            <data.icon className="svg" />
                          </div>
                          {!show && device === "tablet" ? (
                            ""
                          ) : (
                            <motion.div exit={{ width: 0 }} className="link">
                              <div className="link-title">{data.title}</div>
                            </motion.div>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
});

const links = [
  { title: "Dashboard", icon: Dashboard, url: "/dashboard" },
  {
    title: "Quiz",
    icon: CreateQuiz,
    url: "/quiz",
  },
  {
    title: "Past Questions",
    icon: DynamicFormRoundedIcon,
    url: "/past-questions",
  },
  {
    title: "Get Coin",
    icon: MonetizationOnOutlinedIcon,
    url: "/get-coin",
  },
  { title: "Logout", icon: LogoutOutlinedIcon, url: "/logout" },
];

const link2 = [
  { title: "Share Idea", icon: PsychologyOutlinedIcon, url: "/share-idea" },
  { title: "Share Web", icon: ShareOutlinedIcon, url: "#share-web" },
  { title: "Contribute", icon: AllInclusiveIcon, url: "/contribute" },
  { title: "Report", icon: ReportIcon, url: "/report" },
];
