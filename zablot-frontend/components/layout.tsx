/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import Notifications from "@comp/global/header/Notifications";
import FriendRequests from "@comp/global/header/FriendRequest";
import SearchBar from "@comp/global/header/SearchBar";
import ProfileCard from "@comp/global/header/ProfileCard";
import React from "react";
import Sidebar from "@comp/global/sidebar/Sidebar";
import { Container, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Coin from "./coin";
import BottomNavigation from "@comp/global/bottomNavigation";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import SearchIcon from "@mui/icons-material/Search";
import Header from "./global/header";
import CreatedQuestion from "@comp/quiz/createdQuestion";
import AppChatBoard from "@comp/global/header/chatboard";
import ChatRoom from "@comp/global/chatroom";

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
            <Header />
            <Container
              maxWidth="xl"
              sx={{ px: "0px!important" }}
              className="main pb-[50px] sm:pb-0"
            >
              {children}

              <CreatedQuestion />
            </Container>
          </div>
        </div>
      </div>
      <FriendRequests />
      <SearchBar />
      <Notifications />
      <ProfileCard />
      <AppChatBoard />

      <ChatRoom />
      <BottomNavigation />
    </ThemeProvider>
  );
});
