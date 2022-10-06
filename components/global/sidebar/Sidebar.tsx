/* eslint-disable @next/next/no-img-element */
import React from "react";
import { NextRouter, useRouter } from "next/router";
import { AppContext } from "../../../lib/context";
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
import PeopleIcon from "@mui/icons-material/People";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import IconButton from "@mui/material/IconButton";
import DynamicFormRoundedIcon from "@mui/icons-material/DynamicFormRounded";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const links = [
  { title: "Dashboard", icon: Dashboard, url: "/dashboard" },
  { title: "Create Quiz", icon: CreateQuiz, url: "/create-quiz" },
  {
    title: "Past Questions",
    icon: DynamicFormRoundedIcon,
    url: "/past-questions",
  },
  {
    title: "Attempt Quiz",
    icon: QuestionMarkOutlinedIcon,
    url: "/attempt-quiz",
  },
  {
    title: "Get Coin",
    icon: MonetizationOnOutlinedIcon,
    url: "/get-coin",
  },
  { title: "Logout", icon: LogoutOutlinedIcon, url: "#" },
];

const link2 = [
  { title: "Share Idea", icon: PsychologyOutlinedIcon, url: "#" },
  { title: "Share Web", icon: ShareOutlinedIcon, url: "#" },
  { title: "Contribute", icon: AllInclusiveIcon, url: "#" },
  { title: "Report", icon: ReportIcon, url: "#" },
];

type Tooltip = {
  title: string;
  top: number;
  open: boolean;
};

export default function Sidebar() {
  const {
    state: { user, active },
  } = React.useContext(AppContext);
  const sidebar: React.MutableRefObject<HTMLDivElement> =
    React.useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = React.useState<Tooltip>({
    open: false,
    title: "",
    top: 0,
  });
  const router: NextRouter = useRouter();

  const openSidebar = () => {
    const bar = sidebar.current;
    if (!bar.classList.contains("show"))
      document.querySelector(".show")?.classList.remove("show");
    bar.classList.toggle("show");
  };

  const MouseEnter = (e: React.MouseEvent) => {
    var width = window.innerWidth;

    if (width > 1000) return;

    var target = (e.target as HTMLElement).closest("li");
    var parent = target.offsetParent;
    var title = target.dataset.title;
    var offsetTop = target.offsetTop;

    setTimeout(() => {
      setTooltip({ open: true, title, top: offsetTop + 6 - parent.scrollTop });
    }, 100);
  };

  const logOut = async () => {
    var response = await axios.get<string>("/logout");
    alert(response.data);

    return router.replace("/login");
  };

  return (
    <div
      className="navigator sidebar sticky"
      onMouseLeave={() =>
        setTimeout(() => {
          setTooltip({ ...tooltip, open: false });
        }, 200)
      }
      ref={sidebar}
    >
      <IconButton className="open" onClick={openSidebar}>
        <MenuRoundedIcon />
      </IconButton>
      <AnimatePresence exitBeforeEnter={true} initial={false}>
        {tooltip.open && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{
              scale: 1,
            }}
            className="nav-tooltip"
            style={{
              position: "fixed",
              top: tooltip.top,
              left: 60,
              background: "#fff",
              padding: "10px",
              borderRadius: 10,
            }}
          >
            <span className="title">{tooltip.title}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="navigator-wrapper">
        <div className="preview-profile">
          <div className="user-image-name-wrapper">
            <div className="user-image">
              <Image
                src="/images/4e92ca89-66af-4600-baf8-970068bcff16.jpg"
                alt="/"
                width={35}
                height={35}
                priority={true}
                className="image"
              />
            </div>
            <div className="name-wrap">
              <div className="name">{user?.FullName}</div>
              <div className="username">@{user?.UserName}</div>
            </div>
          </div>
        </div>
        <div className="links-container navigators">
          <div className="message-from-zablot">
            <div className="message">
              Good day TJ, hope you are having a nice day
            </div>
          </div>
          <div className="group-1 face-1 links-wrapper">
            <ul className="links-list">
              {links.map((data, index) => {
                return (
                  <li
                    key={index}
                    onMouseEnter={MouseEnter}
                    onMouseLeave={() => setTooltip({ ...tooltip, open: false })}
                    data-title={data.title}
                    className={
                      data.url === router.route
                        ? "link-wrap active"
                        : "link-wrap"
                    }
                  >
                    <Link href={data.url} passHref>
                      <a
                        href="#"
                        onClick={data.title !== "Logout" ? null : logOut}
                      >
                        <div className="icon-wrap">
                          <data.icon fontSize="small" className="svg" />
                        </div>
                        <div className="link">
                          <div className="link-title">{data.title}</div>
                        </div>
                      </a>
                    </Link>
                  </li>
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
                    onMouseLeave={() => setTooltip({ ...tooltip, open: false })}
                    data-title={data.title}
                  >
                    <Link href={data.url} passHref>
                      <a href="#">
                        <div className="icon-wrap">
                          <data.icon className="svg" />
                        </div>
                        <div className="link">
                          <div className="link-title">{data.title}</div>
                        </div>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
