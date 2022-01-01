import React, {
	useImperativeHandle,
	useState,
	forwardRef,
	useCallback,
	Fragment,
	useContext,
} from "react";
import {useSnackbar} from "notistack";
import * as Interfaces from "../../../lib/interfaces";
import {motion, AnimatePresence} from "framer-motion";
import axios from "axios";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {AppContext} from "../../../lib/context";
import {CircularProgress} from "@mui/material";
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
	Password?: T;
	QuizType?: T;
}

interface quizDetailsInterface {
	name: string;
	quizName: string;
	questionsLength: number;
	closeTime?: Date;
	openTime?: Date;
	type: string;
	password?: string;
	quizId: string;
	duration: number;
}
function Content({questions, setOpen}) {
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [formData, setFormData] = useState<Form<string>>({
		Duration: "",
		QuizName: "",
		CloseTime: "",
		OpenTime: "",
		Purpose: "",
		Password: "",
		QuizType: "Public",
	});
	const {
		state: {
			user: {FullName},
		},
	} = useContext(AppContext);
	const [errors, setErrors] = useState<Form<boolean>>(null);
	const [show, setShow] = useState<boolean>(false);
	const [IsUploading, setIsUploading] = useState<boolean>(false);
	const [quizUploadedDetails, setQuizUploadedDetails] =
		useState<quizDetailsInterface>();

	const Time = (newValue: string, name: "OpenTime" | "CloseTime") => {
		setFormData({...formData, ...{[name]: newValue}});
	};

	const showSnackbar = useCallback(
		(message: string, variant?: "error" | "success") => {
			enqueueSnackbar(message, {
				anchorOrigin: {
					vertical: variant === "success" ? "bottom" : "top",
					horizontal: "center",
				},
				variant: variant,
				autoHideDuration: 3000,
			});
		},
		[enqueueSnackbar]
	);
	const handleChange = (e) => {
		e.preventDefault();
		let target = e.target as HTMLInputElement;
		setFormData({...formData, ...{[target.name]: target.value}});
		if (errors) {
			setErrors({
				Duration: !Boolean(formData.Duration),
				QuizName: !Boolean(formData.QuizName),
				CloseTime: !Boolean(new Date(formData.CloseTime)),
				OpenTime: !Boolean(new Date(formData.OpenTime)),
				Purpose: !Boolean(formData.Purpose),
				Password: !Boolean(formData.Password),
			});
		}
	};

	const uploadQuestion = useCallback(
		async (e) => {
			e.preventDefault();
			e.stopPropagation();

			if (IsUploading) return;

			console.log(e.target);
			console.log(formData);
			let errors = Object.create({});

			if (isNaN(formData.Duration as unknown as number))
				Object.assign(errors, {Duration: true});
			if (!Boolean(formData.QuizName))
				Object.assign(errors, {QuizName: true});
			if (!Boolean(formData.Purpose))
				Object.assign(errors, {Purpose: true});
			if (!Boolean(new Date(formData.OpenTime)))
				Object.assign(errors, {OpenTime: true});
			if (!Boolean(new Date(formData.CloseTime)))
				Object.assign(errors, {CloseTime: true});
			if (formData.QuizType === "private") {
				if (!Boolean(formData.Password))
					Object.assign(errors, {Password: true});
			}

			if (Object.keys(errors)?.length) {
				setErrors(errors);
				return;
			}

			setIsUploading(true);
			Object.assign(formData, {name: FullName, Questions: questions});

			try {
				const response = await axios.post("/api/quiz/upload", formData);

				setQuizUploadedDetails({
					name: FullName,
					quizId: response.data._id,
					questionsLength: questions.length,
					duration: formData.Duration as unknown as number,
					type: formData.QuizType,
					password: formData.Password,
				});
			} catch (error) {
				showSnackbar(error.message, "error");
			}
		},
		[IsUploading, formData, FullName, questions, showSnackbar]
	);

	const handleClickShowPassword = () => {
		setShow(!show);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();

		console.log(formData);
	};

	if (quizUploadedDetails) {
		return (
			<div className="container">
				<div className="title">Quiz Details</div>
				<div className="main">
					<div className="uploader-name">
						<div className="title">Uploader Name</div>
						<div className="text">{quizUploadedDetails.name}</div>
					</div>
					<div className="quiz-id">
						<div className="title">Quiz id</div>
						<div className="text">{quizUploadedDetails.quizId}</div>
					</div>
					<div className="quiz_name">
						<div className="title">Quiz Name</div>
						<div className="text">
							{quizUploadedDetails.quizName}
						</div>
					</div>
					<div className="open-time">
						<div className="title">Open time</div>
						<div className="text">
							{quizUploadedDetails?.openTime ?? "Opened"}
						</div>
					</div>
					<div className="close-time">
						<div className="title">Close time</div>
						<div className="text">
							{quizUploadedDetails?.closeTime ?? "always opened"}
						</div>
					</div>
					<div className="password">
						<div className="title">Password</div>
						<div className="text">
							{quizUploadedDetails?.password ?? "always opened"}
						</div>
					</div>
				</div>
			</div>
		);
	}
	if (IsUploading) {
		return (
			<div className="loader">
				<div className="loader-wrapper">
					<CircularProgress />
					Uploading...
				</div>
			</div>
		);
	}
	return (
		<Fragment>
			<div className="header save-header">
				<div className="title">
					Add few details to your quiz for identification
				</div>
			</div>
			<div className="main-page-content">
				<form
					action="#"
					className="form-group"
					autoComplete="off"
					onSubmit={uploadQuestion}
				>
					<div className="form-wrapper">
						<TextField
							fullWidth
							error={errors?.QuizName}
							label="Quiz name*"
							margin="dense"
							value={formData?.QuizName ?? ""}
							onChange={handleChange}
							name="QuizName"
							variant="outlined"
							autoComplete="new-quiz-name"
							autoCapitalize="true"
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
							value={formData?.Purpose ?? ""}
							onChange={handleChange}
							autoComplete="new-purpose"
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
							value={formData?.Duration ?? ""}
							onChange={handleChange}
							helperText={
								errors?.Duration &&
								"Time to be use to attempt the quiz: example "
							}
						/>
						<TextField
							className="text-field-type-select"
							type="text"
							name="QuizType"
							select
							margin="dense"
							autoComplete="new-type"
							onChange={handleChange}
							value={formData?.QuizType ?? "Public"}
							error={errors?.QuizType}
						>
							<MenuItem value="Private">Private</MenuItem>
							<MenuItem value="Public">Public</MenuItem>
						</TextField>
						{formData?.QuizType === "Private" && (
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
									value={formData?.Password ?? ""}
									onChange={handleChange}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={
													handleClickShowPassword
												}
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
										This is makes your quiz private and
										secured
									</FormHelperText>
								)}
							</FormControl>
						)}
						<div className="additional-fields">
							<div className="title">
								<div className="text">Additional options</div>
							</div>
							<div className="time-wrapper">
								<LocalizationProvider
									dateAdapter={AdapterDateFns}
								>
									<MobileDateTimePicker
										renderInput={(props) => {
											props.error =
												errors?.OpenTime ?? false;
											return (
												<TextField
													name="OpenTime"
													margin="dense"
													helperText={
														errors?.OpenTime &&
														"Invalid DateTime"
													}
													{...props}
												/>
											);
										}}
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
										renderInput={(props) => {
											props.error =
												errors?.CloseTime ?? false;
											return (
												<TextField
													name="CloseTime"
													margin="dense"
													helperText={
														props?.error &&
														"Invalid DateTime"
													}
													{...props}
												/>
											);
										}}
										onError={console.log}
										minDate={new Date("2021-01-01T00:00")}
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
