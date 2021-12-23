/* eslint-disable @next/next/no-css-tags */
/* eslint-disable react/no-unescaped-entities */
// @ts-check
import {Fragment, useEffect, useRef, useState, useContext} from "react";
import {useRouter} from "next/router";
import Head from "next/head";
import Link from "next/link";
import j from "jquery";
import {
	Button,
	FormControl,
	FormHelperText,
	IconButton,
	FilledInput,
	InputAdornment,
	InputLabel,
	CircularProgress,
	Typography,
} from "@mui/material";
import {MessagesContext} from "../../lib/messages-context";
import axios from "axios";
import Layout from "../../src/layout";
import {Box} from "@mui/system";
import {useForm} from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {useSnackbar} from "notistack";
import Slide from "@mui/material/Slide";

function Login({message}) {
	const router = useRouter();
	const [show, setShow] = useState<boolean>(false);
	const [requestLoading, setRequestLoading] = useState(false);
	const [loggedIn, setLoggedIn] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		formState: {errors},
	} = useForm();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const handleClickShowPassword = () => {
		setShow(!show);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	interface FormInterface {
		Email: string;
		Password: string;
	}

	const submitForm = async (data: FormInterface): Promise<void> => {
		try {
			if (!requestLoading && !loggedIn) {
				setRequestLoading(true);
				const sendFormData = await axios.post("/api/users/login", data);
				setRequestLoading(false);

				enqueueSnackbar(
					sendFormData.data?.success ||
						sendFormData.data?.not_success,
					{
						anchorOrigin: {
							vertical: "top",
							horizontal: "center",
						},
						variant: sendFormData.data?.success
							? "success"
							: "error",
						TransitionComponent: Slide,
						autoHideDuration: 2000,
					}
				);

				if (Boolean(sendFormData.data?.success)) {
					setLoggedIn(true);
					router.replace("/dashboard");
					return;
				}
			}
		} catch (err) {
			setRequestLoading(false);
			enqueueSnackbar(err.message + ";\nCheck your connection", {
				variant: "error",
			});
		}
	};

	return (
		<Layout title="Login Page" text="Sign Up" href="/register">
			<Box
				component="form"
				onSubmit={handleSubmit(submitForm)}
				sx={{
					display: "block",
					maxWidth: "90vw",
					width: 600,
					mx: "auto",
				}}
			>
				<Typography
					component="h3"
					variant="h6"
					textAlign="center"
					m={3}
				>
					Login
				</Typography>
				<FormControl
					variant="filled"
					fullWidth
					sx={{display: "block", m: 2, bgcolor: "secondary"}}
					error={errors?.Email ? true : false}
				>
					<InputLabel htmlFor="standard-adornment-email">
						Enter your email *
					</InputLabel>
					<FilledInput
						fullWidth
						id="standard-adornment-email"
						type="email"
						sx={{bgcolor: "grey"}}
						{...register("Email", {
							required: "true",
							pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
						})}
					/>
					<FormHelperText>
						{errors?.Email?.type === "required"
							? "Please Enter Your Email"
							: errors?.Email?.type === "pattern"
							? "Email not valid"
							: null}{" "}
					</FormHelperText>
				</FormControl>
				<FormControl
					fullWidth
					sx={{display: "block", m: 2}}
					variant="filled"
					error={errors?.Password ? true : false}
				>
					<InputLabel htmlFor="standard-adornment-password">
						Password
					</InputLabel>
					<FilledInput
						fullWidth
						id="standard-adornment-password"
						type={show ? "text" : "password"}
						{...register("Password", {
							required: true,
							minLength: 4,
						})}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
								>
									{show ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
					<FormHelperText>
						{errors?.Password?.type === "required"
							? "Please Enter Your Password"
							: errors?.Password?.type === "minLength"
							? "Password length must be greater than 8"
							: null}{" "}
					</FormHelperText>
				</FormControl>
				<Button
					type="submit"
					variant="contained"
					size="medium"
					sx={{
						m: 2,
						width: 200,
						// bgcolor: "#525252",
						// "&:hover": {
						// 	bgcolor: "#767675",
						// },
					}}
				>
					{requestLoading || loggedIn ? (
						<>
							<CircularProgress
								size={20}
								color="inherit"
								sx={{mr: 2}}
							/>
							{loggedIn ? "Redirecting..." : "Submitting..."}
						</>
					) : (
						"Submit"
					)}
				</Button>
			</Box>
		</Layout>
	);
}

export async function getServerSideProps({req, res}) {
	const flash = req?.session?.flash;

	return {
		props: {
			message: flash?.Error || null,
		},
	};
}

export default Login;
