import {
	AppBar,
	Chip,
	Container,
	CssBaseline,
	ThemeProvider,
	Toolbar,
	Link as A,
	Typography,
} from "@mui/material";
import {createTheme} from "@mui/material/styles";
import Link from "next/link";
import Head from "next/head";
import {Fragment, useRef, useEffect, useState} from "react";
import {useRouter} from "next/router";
import Styles from "../src/styles";
// import { Menu as MenuIcon, Notifications, GroupAdd } from "@material-ui/icons";

interface DrawerInterface {
	current: {toggleDrawer(): void};
}

interface props {
	children: React.ReactNode;
	text: string;
	title: string;
	href: string;
}

function Layout(props: props): JSX.Element {
	const classes = Styles();
	let theme = createTheme({
		palette: {
			primary: {
				main: "#367588",
			},
		},
	});
	return (
		<ThemeProvider theme={theme}>
			<Head>
				<title>{props.title}</title>
			</Head>
			<CssBaseline />
			<AppBar position="sticky" sx={{background: "#f6f6f6"}}>
				<Toolbar sx={{position: "relative", height: 50}}>
					<Typography
						component="h1"
						variant="body1"
						sx={{flexGrow: 1, color: "#767675", fontWeight: 700}}
					>
						Zablot
					</Typography>
					<Link href={props.href} passHref={true}>
						<Chip
							label={props.text}
							sx={{fontSize: 13, fontWeight: 500}}
						/>
					</Link>
				</Toolbar>
			</AppBar>
			<Container sx={{py: 1}} className={classes.label}>
				{props.children}
			</Container>
		</ThemeProvider>
	);
}

// function Navbar(): JSX.Element {
//   const [toggled, setToggled] = useState<boolean>(false);

//   const ChipComponent: React.FC = (): JSX.Element => {
//     return (
//       <Chip
//         avatar={<Avatar alt="TJ DIBBS"></Avatar>}
//         label="TJ DIBBS"
//         color="info"
//         clickable={true}
//         onClick={() => setToggled(true)}
//       ></Chip>
//     );
//   };

//   const MenuBar = (): JSX.Element => {
//     return (
//       <Box sx={{ minHeight: 200, minWidth: 200, p: 2, position: "relative" }}>
//         Menubar
//       </Box>
//     );
//   };

//   if (!toggled) return <ChipComponent />;
//   return <MenuBar />;
// }

export default Layout;
