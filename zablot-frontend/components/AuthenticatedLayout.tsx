import Notifications from "@comp/global/header/Notifications";
import FriendRequests from "@comp/global/header/FriendRequest";
import SearchBar from "@comp/global/header/SearchBar";
import ProfileCard from "@comp/global/header/ProfileCard";
import React from "react";
import Sidebar from "@comp/global/sidebar/Sidebar";
import { Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BottomNavigation from "@comp/global/bottomNavigation";
import Header from "@comp/global/header";
import CreatedQuestion from "@comp/quiz/createdQuestion";
import AppChatBoard from "@comp/global/header/chatboard";
import ChatRoom from "@comp/global/chatroom";
import { useAppDispatch } from "@lib/redux/store";
import { useSocket } from "@lib/socket";
import { SOCKET } from "@lib/redux/userSlice";
import { PropsInterface } from "@comp/Layout";

const AuthenticationLayout = (props: PropsInterface) => {
  const { children } = props;
  const theme = createTheme({
    palette: {
      primary: {
        main: "#35a3b4",
      },
    },
  });

  const dispatch = useAppDispatch();
  const socket = useSocket("http://localhost:8000", true);

  React.useEffect(() => {
    if (socket) dispatch(SOCKET({ socket }));
  }, [dispatch, socket]);

  return (
    <ThemeProvider theme={theme}>
      <div className="app relative max-w-screen-xl mx-auto">
        <div className="app-container relative">
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
      </div>
    </ThemeProvider>
  );
};

export default AuthenticationLayout;
