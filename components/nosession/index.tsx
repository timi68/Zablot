import React from "react";
import {Paper, Button, Typography} from "@mui/material";
import {useRouter, NextRouter} from "next/router";
import AppLayout from "../../src/AppLayout";

function NoSession() {
	const router: NextRouter = useRouter();
	return (
		<AppLayout
			loggedIn={false}
			href="/login"
			text="Login"
			title="No session available"
		>
			<Paper
				elevation={6}
				sx={{
					m: "auto",
					maxWidth: 600,
					width: 600,
					my: 10,
					height: "calc(100vh - 200px)",
					display: "grid",
					placeItems: "center",
				}}
			>
				<Typography component="h1" variant="body1" my={1}>
					There is no session available
				</Typography>
				<Button
					size="medium"
					variant="contained"
					onClick={() => router.push("/login")}
				>
					Go to login page
				</Button>
			</Paper>
		</AppLayout>
	);
}

export default NoSession;
