/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import {SocketContext} from "../../lib/socket";
import Notifications from "../../components/global/header/Notifications";
import FriendRequests from "../../components/global/header/FriendRequest";
import SearchBar from "../../components/global/header/SearchBar";
import ProfileCard from "../../components/global/header/ProfileCard";
import {useContext} from "react";
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
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {Box} from "@mui/system";

export default function AppLayout({children}) {
	console.log("mounting from after");
	return (
		<div className="container">
			<div className="wrapper">
				<AppBar
					position="sticky"
					className="page-header header main-header"
					component="header"
				>
					<Toolbar>
						<Box
							component="div"
							className="float-left"
							sx={{flexGrow: 1}}
						>
							<Stack direction="row" spacing={2}>
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
						<Stack
							direction="row"
							spacing={1.5}
							className="top-navigation notifications-container friendresquest-box profile-box"
						>
							<Chip
								label="500"
								className="coin-wrapper"
								icon={<MonetizationOnIcon fontSize="small" />}
							/>
							<FriendRequests />
							<Notifications />
							<Badge color="secondary" badgeContent={0} showZero>
								<IconButton
									className="open"
									// onClick={() => {
									// 	setOpenModal(!openModal);
									// 	handleOpen();
									// }}
								>
									<ChatBubbleOutlineIcon size="small" />
								</IconButton>
							</Badge>
							<ProfileCard />
						</Stack>
					</Toolbar>
				</AppBar>
				<Container
					sx={{
						"&.MuiContainer-root": {
							p: 0,
							maxWidth: "100vw",
						},
					}}
				>
					{children}
				</Container>
			</div>
		</div>
	);
}
