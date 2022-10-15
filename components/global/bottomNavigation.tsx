import React from "react";
import { IconButton, Box, Avatar, Divider } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import stringToColor from "@utils/stringToColor";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import Link from "next/link";
import { RESIZE } from "@lib/redux/userSlice";
import { useRouter } from "next/router";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import NotificationsActive from "@mui/icons-material/NotificationsActive";

const MobileNavigation = () => {
  const [expand, setExpand] = React.useState("");
  const { user, device } = useAppSelector((state) => state.sessionStore);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useCustomEventListener("off", () => {
    setExpand("");
  });

  React.useEffect(() => {
    window.onresize = () => {
      let w = window.innerWidth;
      if (w < 500 && device !== "mobile") {
        dispatch(RESIZE("mobile"));
      } else if (w < 1000 && device !== "tablet") {
        dispatch(RESIZE("tablet"));
      } else if (w > 1000 && device !== "desktop") {
        dispatch(RESIZE("desktop"));
      }
    };
    console.log({ router });
    return () => {
      window.onresize = null;
    };
  }, [device, dispatch, router]);

  if (!user || device !== "mobile") return <></>;

  const handleClick = (name: string) => {
    emitCustomEvent("toggle", name);
    setExpand(name);
  };

  const className = (n: string) => "open" + (n === expand ? " active" : "");

  return (
    <Box className="mobile sm:hidden bg-lightgrey z-[99999] nav fixed bottom-0 left-0 w-screen pb-3">
      <Divider className="mb-4" />
      <div className="flex justify-around items-center">
        {nav.map((button) => (
          <IconButton
            key={button.path}
            className={className(button.path)}
            onClick={() => handleClick(button.path)}
          >
            {button.icon}
          </IconButton>
        ))}
      </div>
    </Box>
  );
};

const nav = [
  {
    icon: <HomeIcon fontSize="small" />,
    path: "/",
  },
  {
    icon: <SearchRoundedIcon fontSize="small" />,
    path: "s",
  },
  {
    icon: <PersonAddIcon fontSize="small" />,
    path: "f",
  },
  {
    icon: (
      <svg viewBox="0 0 28 28" height="20" width="20">
        <path d="M14 2.042c6.76 0 12 4.952 12 11.64S20.76 25.322 14 25.322a13.091 13.091 0 0 1-3.474-.461.956 .956 0 0 0-.641.047L7.5 25.959a.961.961 0 0 1-1.348-.849l-.065-2.134a.957.957 0 0 0-.322-.684A11.389 11.389 0 0 1 2 13.682C2 6.994 7.24 2.042 14 2.042ZM6.794 17.086a.57.57 0 0 0 .827.758l3.786-2.874a.722.722 0 0 1 .868 0l2.8 2.1a1.8 1.8 0 0 0 2.6-.481l3.525-5.592a.57.57 0 0 0-.827-.758l-3.786 2.874a.722.722 0 0 1-.868 0l-2.8-2.1a1.8 1.8 0 0 0-2.6.481Z"></path>
      </svg>
    ),
    path: "c",
  },
  {
    icon: <NotificationsActive fontSize="small" />,
    path: "n",
  },
];

export default React.memo(MobileNavigation);
