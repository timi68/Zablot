import React from "react";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {IconButton, Container, CircularProgress} from "@mui/material";

const Poll = React.forwardRef((props, ref) => {
	const [open, setOpen] = React.useState<boolean>(false);

	React.useImperativeHandle(
		ref,
		() => ({
			toggle() {
				setOpen(true);
			},
		}),
		[]
	);

	return (
		<div className="create-question create-poll">
			<div className="poll-header">
				<div className="title">
					<div className="text">Poll</div>
				</div>
				<div className="discard-wrap">
					<div className="text">
						<span>Discard</span>
					</div>
				</div>
				<div className="create-wrap">
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
							placeholder="Enter your question.."
						></textarea>
					</div>
				</div>
				<div className="question-options">
					<div className="header">
						<div className="title">
							<div className="text">Options</div>
						</div>
						<IconButton className="add-options add">
							<AddRoundedIcon />
						</IconButton>
					</div>
					<ul className="option-list wrap"></ul>
				</div>
				<div className="additional-options">
					<div className="title">
						<div className="text">Additional options</div>
					</div>
					<div className="options">
						<div className="option-wrap timer">
							<label htmlFor="timing" className="label">
								Set time(s)
							</label>
							<input
								className="text-control time"
								type="text"
								id="timing"
								name="time"
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
								maxLength={3}
								autoComplete="new"
							/>
						</div>
						<div className="challenge option-wrap">
							<div className="label-text">
								<div className="text">Challenge</div>
							</div>
							<div className="control">
								<input
									className="radio challenge"
									type="checkbox"
									id="challenge"
									name="challenge"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

Poll.displayName = "Poll";

export default Poll;
