import React, {
	useImperativeHandle,
	useState,
	forwardRef,
	useCallback,
	Fragment,
} from "react";
import * as Interfaces from "../../../lib/interfaces";
import {motion, AnimatePresence} from "framer-motion";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
	TextField,
	FormControl,
	MenuItem,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	IconButton,
	FormLabel,
	FormHelperText,
} from "@mui/material";
import {useForm} from "react-hook-form";

const variant = {
	hidden: {
		y: "-100vh",
		opacity: 0.6,
	},
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			duration: 0.1,
			type: "spring",
			damping: 25,
			stiffness: 500,
		},
	},
	exit: {
		y: "100vh",
		opacity: 0.6,
	},
};

const UploadQuestions = forwardRef((props, ref) => {
	const [questions, setQuestions] = useState<Interfaces.Question[]>([]);
	const [open, setOpen] = useState<boolean>(false);

	useImperativeHandle(
		ref,
		() => ({
			setOpen(questions) {
				console.log(questions);
				setQuestions(questions);
				setOpen(true);
			},
		}),
		[]
	);
	return (
		<div className="upload-question">
			<AnimatePresence
				exitBeforeEnter={true}
				initial={false}
				onExitComplete={() => null}
			>
				{open && (
					<motion.div
						initial={{opacity: 0.8}}
						exit={{opacity: 0.8}}
						animate={{opacity: 1}}
						className="backdrop"
					>
						{/* <CircularProgress color="inherit" /> */}
						<motion.div
							variants={variant}
							initial="hidden"
							animate="visible"
							exit="exit"
							className="wrapper"
						>
							<Content questions={questions} setOpen={setOpen} />
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
});
UploadQuestions.displayName = "Upload Questions";

interface Content {
	questions: Interfaces.Question[];
	setOpen(action: boolean): void;
}

interface Form<T> {
	Duration?: T;
	QuizName?: T;
	CloseTime?: T;
	OpenTime?: T;
	Purpose?: T;
	Type?: T;
	Password: T;
}

function Content({questions, setOpen}) {
	const [formData, setFormData] = useState<Form<string>>();
	const [errors, setErrors] = useState<Form<boolean>>();
	const [show, setShow] = useState<boolean>(false);

	const Time = (newValue: string, name: "OpenTime" | "CloseTime") => {
		setFormData({...formData, ...{[name]: newValue}});
	};

	const handleChange = (e) => {
		let target = e.target as HTMLInputElement;
		setFormData({...formData, ...{[target.name]: target.value}});
	};

	const uploadQuestion = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();

			console.log(e.target);
			console.log(formData);
			setErrors({
				Duration: true,
				QuizName: true,
				CloseTime: true,
				OpenTime: true,
				Purpose: true,
				Type: true,
				Password: true,
			});
		},
		[formData]
	);

	const handleClickShowPassword = () => {
		setShow(!show);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<Fragment>
			<div className="header save-header">
				<div className="title">
					Add few deatils to your quiz for identification
				</div>
			</div>
			<div className="main-page-content">
				<form
					action="#"
					className="form-group"
					onSubmit={uploadQuestion}
				>
					<div className="form-wrapper">
						<TextField
							fullWidth
							error={errors?.QuizName}
							label="Quiz name*"
							margin="dense"
							value={formData?.QuizName}
							onChange={handleChange}
							name="QuizName"
							variant="outlined"
							helperText={
								formData?.QuizName &&
								"The name or subject of the quiz"
							}
						/>
						<TextField
							fullWidth
							error={errors?.Purpose}
							label="Quiz purpose*"
							margin="dense"
							name="Purpose"
							value={formData?.Purpose}
							onChange={handleChange}
							variant="outlined"
							helperText={
								formData?.Purpose &&
								"The purpose of the quiz (Any)"
							}
						/>
						<TextField
							fullWidth
							error={errors?.Duration}
							label="Duration (measure in mins)*"
							margin="dense"
							autoComplete="new-duration"
							name="Duration"
							variant="outlined"
							value={formData?.Duration}
							onChange={handleChange}
							helperText={
								errors?.Duration &&
								"Time to be use to attempt the quiz: example "
							}
						/>

						<FormControl
							variant="outlined"
							sx={{my: ".5em"}}
							error={errors?.Password}
						>
							<InputLabel htmlFor="outlined-adornment-password">
								Password
							</InputLabel>
							<OutlinedInput
								id="outlined-adornment-password"
								error={errors?.Password}
								name="Password"
								autoComplete="new-password"
								type={show ? "text" : "password"}
								value={formData?.Password}
								onChange={handleChange}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											onMouseDown={
												handleMouseDownPassword
											}
											edge="end"
										>
											{show ? (
												<VisibilityOff />
											) : (
												<Visibility />
											)}
										</IconButton>
									</InputAdornment>
								}
								label="Password"
							/>
							{formData?.Password && (
								<FormHelperText>
									This is makes your quiz private and secured
								</FormHelperText>
							)}
						</FormControl>

						<div className="additional-fields">
							<div className="title">
								<div className="text">Additional options</div>
							</div>
							<div className="time-wrapper">
								<LocalizationProvider
									dateAdapter={AdapterDateFns}
								>
									<MobileDateTimePicker
										renderInput={(props) => (
											<TextField
												name="OpenTime"
												margin="dense"
												helperText={
													props?.error &&
													"Invalid DateTime"
												}
												{...props}
											/>
										)}
										onError={console.log}
										minDate={new Date("2021-01-01T00:00")}
										maxDate={new Date("2023-01-01T00:00")}
										inputFormat="yyyy/MM/dd hh:mm a"
										mask="___/__/__ __:__ _M"
										label="Open time"
										value={formData?.OpenTime}
										onChange={(newValue) => {
											Time(newValue, "OpenTime");
										}}
									/>
								</LocalizationProvider>
								<LocalizationProvider
									dateAdapter={AdapterDateFns}
								>
									<MobileDateTimePicker
										renderInput={(props) => (
											<TextField
												name="CloseTime"
												margin="dense"
												helperText={
													props?.error &&
													"Invalid DateTime"
												}
												{...props}
											/>
										)}
										onError={console.log}
										minDate={new Date("2022-01-01T00:00")}
										maxDate={new Date("2023-01-01T00:00")}
										inputFormat="yyyy/MM/dd hh:mm a"
										mask="___/__/__ __:__ _M"
										label="Close time"
										value={formData?.CloseTime}
										onChange={(newValue) => {
											Time(newValue, "CloseTime");
										}}
									/>
								</LocalizationProvider>
							</div>
						</div>
					</div>

					<div className="button-wrap">
						<motion.button
							className="btn finish"
							whileHover={{scale: 1.1}}
						>
							Finish
						</motion.button>
						<motion.button
							className="btn close"
							whileHover={{scale: 1.1}}
							onClick={() => setOpen(false)}
						>
							Close
						</motion.button>
					</div>
				</form>
			</div>
		</Fragment>
	);
}

export default UploadQuestions;
