import React from "react";
import {motion, AnimatePresence} from "framer-motion";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {IconButton} from "@mui/material";
import * as Interfaces from "../../../lib/interfaces";
import j from "jquery";
import {AppContext} from "../../../lib/context";
import Option from "./Option";

const variant = {
	hidden: {
		clipPath: "circle(0.4% at 0 100%)",
	},
	visible: {
		clipPath: "circle(141% at 0 100%)",
		transition: {
			duration: 0.1,
			type: "spring",
		},
	},
	exit: {
		clipPath: "circle(0.4% at 0 100%)",
	},
};

type PropsType = {
	data: Interfaces.RoomType["pollData"];
	toggled: boolean;
	roomBody: React.RefObject<Interfaces.RoomBodyRefType>;
	coming: string;
	_id: string;
	going: string;
};

const Poll = React.forwardRef((props: PropsType, ref) => {
	const [open, setOpen] = React.useState<boolean>(props.toggled);
	const [question, setQuestion] = React.useState<Interfaces.MessageType>(
		props.data
	);
	const {
		state: {socket},
	} = React.useContext(AppContext);
	const PollRef = React.useRef<HTMLUListElement>(null);

	const AddOptions = (): void => {
		let option = {
			text: "",
			checked: false,
		};
		setQuestion((oldState): Interfaces.MessageType => {
			// removing isNew from old options to trigger the correct animation
			const options: Interfaces.MessageType["options"] = [
				...oldState.options,
				...[option],
			];
			return {...oldState, options};
		});
	};

	const HandleQuestionTextChange = (e: React.ChangeEvent<HTMLElement>) => {
		const target = e.target as HTMLInputElement;
		setQuestion({...question, question: target.value});
	};

	const HandleOptionTextChange = (
		e: React.ChangeEvent<HTMLElement>,
		optionIndex: number
	) => {
		const target = e.target as HTMLInputElement;
		setQuestion((oldState) => {
			const options: Interfaces.MessageType["options"] =
				oldState.options.map((option, index) => {
					if (index === optionIndex) option.text = target.value;
					return option;
				});
			const newState = {...oldState, options};
			return newState;
		});
	};

	const HandleAnswerChecked = (optionIndex: number) => {
		setQuestion((oldState) => {
			const options: Interfaces.MessageType["options"] =
				oldState.options.map((option, index) => {
					option.checked = false;

					if (index === optionIndex) option.checked = true;
					return option;
				});
			const newState = {...oldState, options};
			return newState;
		});
	};

	const AdditionalOptions = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name === "challenge") {
			setQuestion({...question, [e.target.name]: e.target.checked});
			return;
		}
		setQuestion({...question, [e.target.name]: e.target.value});
	};

	const RemoveOption = (optionIndex: number) => {
		if (question.options.length < 3) {
			alert("Sorry the Mininum option is 2 error");
			return;
		}
		setQuestion((oldState) => {
			const newOptions: Interfaces.MessageType["options"] =
				oldState.options.filter(
					(_option, index) => index !== optionIndex
				);
			const newState = {...oldState, options: newOptions};
			return newState;
		});
	};

	const SubmitQuestion = () => {
		if (!Boolean(question.question)) {
			alert("Add Question Please error");
			return;
		}

		let notEmptyOption = 0;
		let EmptyOption = 0;
		let isAnyOptionChecked = false;
		question.options.map((option) => {
			if (option.text) notEmptyOption++;
			else EmptyOption++;
			if (option.checked) isAnyOptionChecked = true;
		});

		if (notEmptyOption < 2) alert("Sorry the minimum option is 2");
		else if (EmptyOption > 0) alert("Please remove empty options");
		else if (!isAnyOptionChecked)
			alert("Sorry you need to check the correct option");
		else {
			socket.emit(
				"OUTGOINGFORM",
				question,
				(err: string, {formId, date}: {formId: string; date: Date}) => {
					if (!err) {
						question._id = formId;
						question.date = date;

						props.roomBody.current.setMessages(question, "out");
						SetDefaultState();
					}
				}
			);
		}
	};

	const SetDefaultState = () => {
		setOpen(false);
		setQuestion((state) => {
			return {
				question: "",
				options: [
					{index: 0, text: "", checked: false},
					{index: 1, text: "", checked: false},
				],
			};
		});
	};

	React.useImperativeHandle(
		ref,
		() => ({
			toggle(hide?: boolean) {
				if (hide) setOpen(false);
				else setOpen(true);
			},
			getPollData(): {
				pollData: Interfaces.RoomType["pollData"];
				pollToggled: boolean;
			} {
				return {pollData: question, pollToggled: open};
			},
		}),
		[open, question]
	);

	React.useEffect(() => {
		const mutation = new MutationObserver(function (e) {
			let addedOption = e[0].addedNodes[0];
			if (addedOption) j(addedOption).find("textarea").focus();

			PollRef.current.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		});

		if (open) {
			mutation.observe(PollRef.current, {childList: true});
		}
		return () => {
			mutation.disconnect();
		};
	}, [open]);

	return (
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
				>
					<motion.div
						variants={variant}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="create-question create-poll"
						// ref={PollRef}
					>
						<div className="poll-header">
							<div className="title">
								<div className="text">Poll</div>
							</div>
							<div
								className="discard-wrap"
								onClick={SetDefaultState}
							>
								<div className="text">
									<span>Discard</span>
								</div>
							</div>
							<div
								className="create-wrap"
								onClick={SubmitQuestion}
							>
								<div className="text">
									<span>Create</span>
								</div>
							</div>
						</div>
						<div className="poll-body">
							<div className="question-box">
								<div className="title">
									<div className="text">Question</div>
								</div>
								<div className="text-box question">
									<textarea
										className="text-control"
										id="question"
										name="question"
										onChange={HandleQuestionTextChange}
										placeholder="Enter your question.."
									></textarea>
								</div>
							</div>
							<div className="question-options">
								<div className="header">
									<div className="title">
										<div className="text">Options</div>
									</div>
									{question.options.length < 4 && (
										<IconButton
											className="add-options add"
											onClick={AddOptions}
										>
											<AddRoundedIcon fontSize="small" />
										</IconButton>
									)}
								</div>
								<ul className="option-list wrap" ref={PollRef}>
									<AnimatePresence>
										{question.options.map(
											(option, index) => {
												return (
													<Option
														key={index}
														option={option}
														index={index}
														HandleAnswerChecked={
															HandleAnswerChecked
														}
														HandleOptionTextChange={
															HandleOptionTextChange
														}
														RemoveOption={
															RemoveOption
														}
													/>
												);
											}
										)}
									</AnimatePresence>
								</ul>
							</div>
							<div className="additional-options">
								<div className="title">
									<div className="text">
										Additional options
									</div>
								</div>
								<div className="options">
									<div className="option-wrap timer">
										<label
											htmlFor="timing"
											className="label"
										>
											Set time(s)
										</label>
										<input
											className="text-control time"
											type="text"
											id="timing"
											name="timer"
											onChange={AdditionalOptions}
											maxLength={3}
											autoComplete="new"
										/>
									</div>
									<div className="coin option-wrap">
										<label htmlFor="coin" className="label">
											Add coin
										</label>
										<input
											className="text-control coin"
											type="text"
											id="coin"
											name="coin"
											onChange={AdditionalOptions}
											maxLength={3}
											autoComplete="new"
										/>
									</div>
									<div className="challenge option-wrap">
										<div className="label-text">
											<div className="text">
												Challenge
											</div>
										</div>
										<div className="control">
											<input
												className="radio challenge"
												type="checkbox"
												id="challenge"
												onChange={AdditionalOptions}
												name="challenge"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
});

Poll.displayName = "Poll";

export default Poll;
