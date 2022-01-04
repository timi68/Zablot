/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import {ModalContext} from "../../lib/context";
import Notifications from "../../components/global/header/Notifications";
import FriendRequests from "../../components/global/header/FriendRequest";
import SearchBar from "../../components/global/header/SearchBar";
import ProfileCard from "../../components/global/header/ProfileCard";
import {ReactNode, useRef, Fragment} from "react";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {Box} from "@mui/system";
import Sidebar from "../../components/global/sidebar/Sidebar";
import {
	AppBar,
	Toolbar,
	Stack,
	Chip,
	Typography,
	IconButton,
	Badge,
	ThemeProvider,
	createTheme,
	Container,
} from "@mui/material";

interface props {
	children: ReactNode;
	loggedIn: boolean;
	href?: string;
	text?: string;
	title: string;
}

export default function AppLayout({
	children,
	loggedIn,
	href,
	text,
	title,
}: props) {
	console.log("mounting from after");
	const modalSignal = useRef<HTMLDivElement | null>(null);
	const removeAllShowModal = () => {
		console.log("clicked");
		modalSignal.current.classList.remove("show");
	};
	const theme = createTheme({
		palette: {
			primary: {
				main: "#367588",
			},
		},
	});
	return (
		<ModalContext.Provider value={modalSignal}>
			<ThemeProvider theme={theme}>
				<Head>
					<title>{title}</title>
				</Head>
				<div className="container">
					<div className="wrapper">
						<AppBar
							position="sticky"
							className="header"
							component="header"
						>
							<Toolbar>
								{loggedIn && (
									<Fragment>
										<Box
											component="div"
											className="float-left"
											sx={{flexGrow: 1}}
										>
											<Stack
												direction="row"
												spacing={2}
												alignItems="center"
											>
												<Typography
													component="h2"
													variant="h5"
													color="inherit"
													className="logo title"
													sx={{fontWeight: 700}}
												>
													Zablot
												</Typography>
												<SearchBar />
											</Stack>
										</Box>
										<Box>
											<Stack
												direction="row"
												spacing={1.5}
												className="top-navigation notifications-container friendresquest-box profile-box"
											>
												<Chip
													label="500"
													className="coin-wrapper"
													icon={
														<MonetizationOnIcon fontSize="small" />
													}
												/>
												<FriendRequests />
												<Notifications />
												<Badge
													color="secondary"
													badgeContent={0}
													showZero
												>
													<IconButton
														className="open"
														// onClick={() => {
														// 	setOpenModal(!openModal);
														// 	handleOpen();
														// }}
													>
														<ChatBubbleOutlineIcon fontSize="small" />
													</IconButton>
												</Badge>
												<ProfileCard />
											</Stack>
										</Box>
									</Fragment>
								)}
								{!loggedIn && (
									<Fragment>
										<Typography
											component="h1"
											variant="body1"
											sx={{
												flexGrow: 1,
												color: "#767675",
												fontWeight: 700,
											}}
										>
											Zablot
										</Typography>
										<Link href={href} passHref={true}>
											<Chip
												label={text}
												sx={{
													fontSize: 13,
													fontWeight: 500,
												}}
											/>
										</Link>
									</Fragment>
								)}
							</Toolbar>
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
							{loggedIn && <Sidebar />}
							{children}
						</Container>
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
