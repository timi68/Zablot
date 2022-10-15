/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import Notifications from "@comp/global/header/Notifications";
import FriendRequests from "@comp/global/header/FriendRequest";
import SearchBar from "@comp/global/header/SearchBar";
import ProfileCard from "@comp/global/header/ProfileCard";
import React from "react";
import Sidebar from "@comp/global/sidebar/Sidebar";
import {
  AppBar,
  Toolbar,
  Stack,
  Chip,
  Typography,
  IconButton,
  Badge,
  Container,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Coin from "./coin";
import BottomNavigation from "@comp/global/bottomNavigation";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import SearchIcon from "@mui/icons-material/Search";

interface PropsInterface {
  children: React.ReactNode;
}

export default React.memo(function AppLayout(props: PropsInterface) {
  const { children } = props;
  const theme = createTheme({
    palette: {
      primary: {
        main: "#35a3b4",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="container-fluid relative">
        <div className="wrapper">
          <Sidebar />
          <div className="flex-right">
            <AppBar
              position="sticky"
              sx={{
                display: { xs: "none!important", sm: "flex!important" },
              }}
              className="header"
            >
              <div className="toolbar">
                <Typography
                  component="h2"
                  variant="h5"
                  color="primary"
                  className="logo title display-large"
                  sx={{
                    fontWeight: 700,
                    fontFamily: "Poppins !important",
                  }}
                >
                  Zablot
                </Typography>
                <TopNavigation />
              </div>
            </AppBar>
            <Container
              maxWidth="xl"
              sx={{ px: "0px!important" }}
              className="main"
            >
              {children}
            </Container>
          </div>
        </div>
      </div>
      <FriendRequests />
      <SearchBar />
      <Notifications />
      <ProfileCard />
      <BottomNavigation />
    </ThemeProvider>
  );
});

const TopNavigation = () => {
  const [expand, setExpand] = React.useState("");

  const handleClick = (name: "n" | "f" | "p" | "s") => {
    emitCustomEvent("toggle", name);
    setExpand(name);
  };

  useCustomEventListener("off", () => {
    setExpand("");
  });

  const className = (n: string) => "open" + (n === expand ? " active" : "");
  return (
    <Stack direction="row" spacing={1.5} className="top-navigation flex-grow">
      <div
        className="search-container flex-grow"
        id="search"
        onClick={() => handleClick("s")}
      >
        <div className="search-form dummy">
          <div className="search-icon" role="search">
            <SearchIcon fontSize="small" />
          </div>
          <div className="form-control">
            <input
              type="search"
              role="searchbox"
              aria-autocomplete="none"
              className="text-control text-sm p-0"
              id="text-control"
              placeholder="Search a friend.."
              autoComplete="off"
            />
          </div>
        </div>
      </div>
      <Coin />
      <Badge color="secondary" showZero>
        <IconButton className={className("f")} onClick={() => handleClick("f")}>
          <PersonAddIcon fontSize="small" />
        </IconButton>
      </Badge>
      <Badge color="default" badgeContent={0} showZero>
        <IconButton className={className("n")} onClick={() => handleClick("n")}>
          <NotificationsActiveIcon fontSize="small" />
        </IconButton>
      </Badge>
      <IconButton
        size="medium"
        className={className("p")}
        onClick={() => handleClick("p")}
      >
        {expand === "p" ? (
          <ArrowDropUpIcon fontSize="medium" />
        ) : (
          <ArrowDropDownIcon fontSize="medium" />
        )}
      </IconButton>
    </Stack>
  );
};
