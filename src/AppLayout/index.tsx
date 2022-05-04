/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import { ModalContext } from "../../lib/context";
import Notifications from "../../components/global/header/Notifications";
import FriendRequests from "../../components/global/header/FriendRequest";
import SearchBar from "../../components/global/header/SearchBar";
import ProfileCard from "../../components/global/header/ProfileCard";
import React from "react";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Box } from "@mui/system";
import Sidebar from "../../components/global/sidebar/Sidebar";
import {
  AppBar,
  Toolbar,
  Stack,
  Chip,
  Typography,
  IconButton,
  Badge,
  Container,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppChatBoardType, Friends } from "../../lib/interfaces";

interface PropsInterface {
  children: React.ReactNode;
  loggedIn: boolean;
  href?: string;
  text?: string;
  title: string;
  chatboardRef?: React.RefObject<AppChatBoardType>;
}

export default function AppLayout(props) {
  console.log("mounting from after");
  const { children } = props;
  const modalSignal = React.useRef<HTMLDivElement | null>(null);

  const SearchbarRef = React.useRef(null);
  const chatBoardTogglerRef = React.useRef<HTMLButtonElement>(null);

  const removeAllShowModal = () => {
    modalSignal.current.classList.remove("show");
    chatBoardTogglerRef.current.classList.remove("active");
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#35a3b4",
      },
    },
  });

  return (
    <ModalContext.Provider value={modalSignal}>
      <ThemeProvider theme={theme}>
        <Head>{/* <title>{title}</title> */}</Head>
        <div className="container">
          <div className="wrapper">
            <Sidebar />
            <div className="flex-right">
              <AppBar position="sticky" className="header" component="header">
                <div className="toolbar">
                  <React.Fragment>
                    <Box
                      component="div"
                      className="float-left"
                      sx={{ flexGrow: 1 }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
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
                        <SearchBar ref={SearchbarRef} />
                      </Stack>
                    </Box>
                    <Box>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        className="top-navigation notifications-container friendresquest-box profile-box"
                      >
                        <FriendRequests
                          SearchbarRef={SearchbarRef}
                          ChatboardRef={null}
                        />
                        <Notifications />
                        <Badge
                          color="secondary"
                          badgeContent={0}
                          className="chatboard-badge"
                          showZero
                        >
                          <IconButton
                            className="open"
                            name="chatboard"
                            ref={chatBoardTogglerRef}
                            onClick={(e) => {
                              props.chatboardRef.current?.toggle();
                              chatBoardTogglerRef.current.classList.toggle(
                                "active"
                              );
                            }}
                          >
                            <svg
                              viewBox="0 0 28 28"
                              className="icon"
                              height="20"
                              width="20"
                              fill="grey"
                            >
                              <path d="M14 2.042c6.76 0 12 4.952 12 11.64S20.76 25.322 14 25.322a13.091 13.091 0 0 1-3.474-.461.956 .956 0 0 0-.641.047L7.5 25.959a.961.961 0 0 1-1.348-.849l-.065-2.134a.957.957 0 0 0-.322-.684A11.389 11.389 0 0 1 2 13.682C2 6.994 7.24 2.042 14 2.042ZM6.794 17.086a.57.57 0 0 0 .827.758l3.786-2.874a.722.722 0 0 1 .868 0l2.8 2.1a1.8 1.8 0 0 0 2.6-.481l3.525-5.592a.57.57 0 0 0-.827-.758l-3.786 2.874a.722.722 0 0 1-.868 0l-2.8-2.1a1.8 1.8 0 0 0-2.6.481Z"></path>
                            </svg>
                          </IconButton>
                        </Badge>
                        <Chip
                          label="500"
                          className="coin-wrapper"
                          icon={<MonetizationOnIcon fontSize="small" />}
                        />
                        <ProfileCard />
                      </Stack>
                    </Box>
                  </React.Fragment>
                </div>
              </AppBar>
              <Container
                sx={{
                  "&.MuiContainer-root": {
                    p: 0,
                    maxWidth: "100vw",
                  },
                }}
                className="main"
              >
                {children}
              </Container>
            </div>
            <div
              className="modal_open_signal"
              ref={modalSignal}
              onClick={removeAllShowModal}
            ></div>
          </div>
        </div>
      </ThemeProvider>
    </ModalContext.Provider>
  );
}
