/* eslint-disable @next/next/no-css-tags */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
// @ts-nocheck
import Head from "next/head";
import {Fragment, useRef, useState, useEffect} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import j from "jquery";
// import {MessagesContext} from "../../lib/messages-context";
import Layout from "../../src/layout";
import {
	Button,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormHelperText,
	Slide,
	IconButton,
	FilledInput,
	InputAdornment,
	InputLabel,
	MenuItem,
	TextField,
	Typography,
	CircularProgress,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import {Box} from "@mui/system";
import {useForm, useFormState} from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import {useSnackbar} from "notistack";

function Register() {
	const [date, setDate] = useState(null);
	const router = useRouter();
	const [requestLoading, setRequestLoading] = useState(false);
	const [registered, setRegistered] = useState<boolean>(false);
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [show, setShow] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		setValue,
		formState: {errors},
	} = useForm();

	const handleClickShowPassword = () => {
		setShow(!show);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	interface FormInterface {
		fullName: string;
		UserName: string;
		DateOfBirth: Date;
		Gender: "Male" | "Female" | "Others";
		Email: string;
		Password: string;
	}

	async function submitForm(data: FormInterface): Promise<void> {
		try {
			if (!requestLoading && !registered) {
				setRequestLoading(true);
				const sendFormData = await axios.post(
					"/api/users/register",
					data
				);
				setRequestLoading(false);

				enqueueSnackbar(
					sendFormData.data?.success ||
						sendFormData.data?.Exist ||
						sendFormData.data?.error,
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
					setRegistered(true);
					router.replace("/login");
					return;
				}
			}
		} catch (err) {
			setRequestLoading(false);
			enqueueSnackbar(err.message + ";\nCheck your connection", {
				variant: "error",
			});
		}
	}

	return (
		<Layout text="Sign In" title="Zablot | Register Page" href="/login">
			<Box
				component="form"
				onSubmit={handleSubmit(submitForm)}
				sx={{
					display: "block",
					maxWidth: "90vw",
					width: 600,
					mx: "auto",
				}}
				autoComplete="off"
			>
				<Typography
					component="h6"
					variant="h5"
					textAlign="center"
					m={3}
				>
					Sign Up
				</Typography>
				<TextField
					fullWidth
					label="FULL NAME *"
					type="text"
					margin="dense"
					variant="filled"
					autoComplete="off"
					helperText={
						errors?.fullName?.type === "required"
							? "Please Enter Your Full Name"
							: errors?.fullName?.type === "maxLength"
							? "Name length can't be more than 20"
							: null
					}
					error={Boolean(errors.fullName)}
					{...register("fullName", {required: true, maxLength: 20})}
				/>
				<TextField
					fullWidth
					label="USER NAME *"
					type="text"
					margin="dense"
					autoComplete="off"
					variant="filled"
					helperText={
						errors?.UserName?.type === "required"
							? "Please Enter Your User Name"
							: errors?.UserName?.type === "maxLength"
							? "Name length can't be more than 20"
							: null
					}
					error={Boolean(errors.UserName)}
					{...register("UserName", {required: true, maxLength: 15})}
				/>
				<TextField
					fullWidth
					label="EMAIL *"
					margin="dense"
					variant="filled"
					autoComplete="off"
					helperText={
						errors?.Email?.type === "required"
							? "Please Enter Your Email"
							: errors?.Email?.type === "pattern"
							? "Email not valid"
							: null
					}
					error={Boolean(errors.Email)}
					{...register("Email", {
						required: "true",
						pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
					})}
				/>
				<TextField
					label="Gender"
					select
					error={Boolean(errors.Gender)}
					defaultValue=""
					margin="dense"
					variant="filled"
					helperText={Boolean(errors.Gender) && "Select your gender"}
					{...register("Gender", {
						required: true,
					})}
					sx={{width: "49%", mr: "2%"}}
				>
					<MenuItem value="Male">Male</MenuItem>
					<MenuItem value="Female">Female</MenuItem>
					<MenuItem value="Others">Others</MenuItem>
				</TextField>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<DatePicker
						label="Date Of Birth"
						value={date}
						onChange={(newValue) => {
							let DateOfBirth = new Date(
								newValue
							).toLocaleDateString();
							let reg = new RegExp(
								/[\w+]{2}\/[\w]{1,2}\/(?=[\w+]{4})(?!0)(?!\s*$)/
							).test(DateOfBirth);
							setValue("DateOfBirth", reg ? DateOfBirth : "");
							setDate(newValue);
						}}
						renderInput={(params) => {
							if (!params.error)
								params.error =
									Boolean(errors.DateOfBirth) || params.error;

							return (
								<TextField
									variant="filled"
									margin="dense"
									{...register("DateOfBirth", {
										required: true,
									})}
									sx={{width: "49%"}}
									helperText={
										(Boolean(errors.DateOfBirth) ||
											params.error) &&
										"The date is invalid"
									}
									{...params}
								/>
							);
						}}
					/>
				</LocalizationProvider>
				<FormControl
					fullWidth
					sx={{display: "block", my: 2}}
					variant="filled"
					error={errors?.Password ? true : false}
				>
					<InputLabel htmlFor="filled-adornment-password">
						PASSWORD *
					</InputLabel>
					<FilledInput
						fullWidth
						id="filled-adornment-password"
						autoComplete="off"
						type={show ? "text" : "password"}
						{...register("Password", {
							required: true,
							minLength: 8,
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
					color="primary"
					size="medium"
					sx={{
						my: 2,
						width: 200,
					}}
					fullWidth
				>
					{requestLoading || registered ? (
						<>
							<CircularProgress
								size={20}
								color="inherit"
								sx={{mr: 2}}
							/>
							{registered ? "Redirecting..." : "Submitting..."}
						</>
					) : (
						"Submit"
					)}
				</Button>
			</Box>
		</Layout>
	);
}

export default Register;
