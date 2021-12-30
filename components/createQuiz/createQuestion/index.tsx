import React, {useState} from "react";
import {Button, Box, IconButton, Tooltip} from "@mui/material";
import {motion, AnimatePresence} from "framer-motion";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import {useSnackbar} from "notistack";

interface Handle {
	setQuestions?(newQuestions: Question, questionId?: number): void;
	updateQuestions?(questionid: number, questiondetails: Question): void;
	setOpen?(): void;
	setQuestionToEdit?(questionid: number, questiondetails?: Question): void;
}

type Option = {
	text: string;
	isNew?: boolean;
	checked: boolean;
};

interface Question {
	question: string;
	options: Option[];
}

interface createInterfaceProps {
	setQuestion: {current: Handle};
}

const CreateQuestion = (props: createInterfaceProps) => {
	const [question, setQuestion] = useState<Question>({
		question: "",
		options: [
			{text: "", checked: false},
			{text: "", checked: false},
		],
	});
	const {setQuestion: setRef} = props;
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();

	function showSnackbar(message: string, variant?: "error" | "success") {
		enqueueSnackbar(message, {
			anchorOrigin: {
				vertical: "bottom",
				horizontal: "left",
			},
			variant: variant,
			autoHideDuration: 2000,
		});
	}

	const AddOptions = (): void => {
		let option = {
			text: "",
			checked: false,
			isNew: true,
		};
		setQuestion((oldState): Question => {
			// removing isNew from old options to trigger the correct animation
			let oldOptions = oldState.options.map((option) => {
				delete option.isNew;
				return option;
			});
			const options: Option[] = [...oldOptions, ...[option]];
			return {...oldState, ...{options}};
		});
	};

	const HandleQuestionTextChange = (e: React.ChangeEvent<HTMLElement>) => {
		const target = e.target as HTMLInputElement;
		setQuestion({...question, ...{question: target.value}});
	};

	const HandleOptionTextChange = (
		e: React.ChangeEvent<HTMLElement>,
		optionIndex: number
	) => {
		const target = e.target as HTMLInputElement;
		setQuestion((oldState): Question => {
			const options: Option[] = oldState.options.map((option, index) => {
				if (option?.isNew) delete option.isNew;
				if (index === optionIndex) option.text = target.value;
				return option;
			});
			const newState = {...oldState, ...{options}};
			return newState;
		});
	};

	const HandleAnswerChecked = (optionIndex: number) => {
		setQuestion((oldState): Question => {
			const newOptions: Option[] = oldState.options.map(
				(option, index) => {
					if (option?.isNew) delete option.isNew;
					option.checked = false;

					if (index === optionIndex) option.checked = true;
					return option;
				}
			);
			const newState = {...oldState, ...{options: newOptions}};
			return newState;
		});
	};

	const RemoveOption = (optionIndex: number) => {
		if (question.options.length < 3) {
			showSnackbar("Sorry the Mininum option is 2", "error");
			return;
		}
		setQuestion((oldState): Question => {
			const newOptions: Option[] = oldState.options.filter(
				(option, index) => {
					if (option?.isNew) delete option.isNew;
					return index !== optionIndex;
				}
			);
			const newState = {...oldState, ...{options: newOptions}};
			return newState;
		});
	};

	const SubmitQuestion = () => {
		if (!Boolean(question.question)) {
			showSnackbar("Add Question Please", "error");
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

		if (notEmptyOption < 2)
			showSnackbar("Sorry the minimum option is 2", "error");
		else if (EmptyOption > 0)
			showSnackbar("Please remove empty options", "error");
		else if (!isAnyOptionChecked)
			showSnackbar("Sorry you need to check the correct option", "error");
		else setRef.current.setQuestions(question), SetDefaultState();
	};

	const SetDefaultState = () => {
		setQuestion((state) => {
			return {
				question: "",
				options: [
					{text: "", checked: false},
					{text: "", checked: false},
				],
			};
		});
	};

	return (
		<Box
			sx={{flexGrow: 1}}
			className="create-question-container create-box"
		>
			<div className="create-card form-container">
				<Box className="create-wrap wrapper">
					<div className="header">
						<h3 className="title">CREATE YOUR QUIZ</h3>
					</div>
					<Box
						className="question-form"
						sx={{
							display: "flex",
							flexDirection: "column",
							gap: 3,
						}}
					>
						<div className="question-wrap">
							<div className="title">
								<div className="text">Question</div>
							</div>
							<textarea
								className="question-box textfield"
								id="question"
								value={question.question}
								onChange={HandleQuestionTextChange}
								placeholder="Enter your question.."
							/>
						</div>
						<div className="options-wrap">
							<div className="header">
								<div className="title">Options</div>
								{question.options.length < 4 && (
									<Tooltip
										title="Add options"
										placement="left"
									>
										<IconButton
											className="add"
											size="small"
											onClick={AddOptions}
											aria-label="add option button"
										>
											<AddIcon fontSize="small" />
										</IconButton>
									</Tooltip>
								)}
							</div>
							<div className="options-wrapper" role="listbox">
								<ul
									className="option-list-container"
									role="list"
								>
									<AnimatePresence>
										{question.options.map(
											(option: Option, index: number) => {
												return (
													<div
														key={index}
														className="option"
														role="listitem"
													>
														<motion.div
															className="text-box"
															animate={{
																height: 40,
																boxShadow:
																	"0px 2px 7px rgb(182,182,182)",
															}}
															initial={{
																height: 0,
																boxShadow:
																	"0px 0px 0px whitesmoke",
															}}
															exit={{
																height: 0,
																boxShadow:
																	"0px 0px 0px whitesmoke",
															}}
														>
															<input
																type="checkbox"
																name="radio-input"
																checked={
																	option.checked
																}
																onChange={() =>
																	HandleAnswerChecked(
																		index
																	)
																}
																className="answer checkbox"
																id="answer"
															/>
															<textarea
																name="option-input"
																id=""
																value={
																	option.text
																}
																onChange={(e) =>
																	HandleOptionTextChange(
																		e,
																		index
																	)
																}
																placeholder="Enter option"
																className="text-control textarea"
															></textarea>
															<IconButton
																size="small"
																onClick={() =>
																	RemoveOption(
																		index
																	)
																}
																className="remove-btn remove-option btn"
															>
																<CancelIcon fontSize="small" />
															</IconButton>
														</motion.div>
													</div>
												);
											}
										)}
									</AnimatePresence>
								</ul>
							</div>
						</div>
						<div className="button-wrap">
							<Button
								className="create-btn btn"
								onClick={SubmitQuestion}
							>
								Save
							</Button>
							<Button
								className="reset-btn btn"
								onClick={SetDefaultState}
							>
								Reset
							</Button>
						</div>
					</Box>
				</Box>
			</div>
		</Box>
	);
};

export default CreateQuestion;
