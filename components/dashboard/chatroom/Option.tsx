import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import {IconButton, Tooltip} from "@mui/material";
import {motion} from "framer-motion";

type OptionType = {text: string; checked: boolean};
const variant = {
	visible: {
		height: 30,
		boxShadow: "0px 2px 7px rgb(182,182,182)",
	},
	hidden: {
		height: 0,
		boxShadow: "0px 0px 0px whitesmoke",
	},
	exit: {opacity: 0, boxShadow: "0px 0px 0px whitesmoke"},
};

function Option(props: {
	option: OptionType;
	index: number;
	HandleAnswerChecked(index: number): void;
	HandleOptionTextChange(
		e: React.ChangeEvent<HTMLTextAreaElement>,
		index: number
	): void;
	RemoveOption(index: number): void;
}) {
	return (
		<motion.li
			className="option"
			variants={variant}
			initial="hidden"
			animate="visible"
			exit="exit"
		>
			<div className="text-box">
				<Tooltip title="Answer" placement="right">
					<input
						type="radio"
						name={props.option.text}
						id="answer"
						className="answer"
						onChange={() => props.HandleAnswerChecked(props.index)}
						checked={props.option.checked}
					/>
				</Tooltip>
				<textarea
					name="option-input"
					placeholder="Enter option.."
					className="text-control text-box"
					value={props.option.text}
					onChange={(e) => {
						props.HandleOptionTextChange(e, props.index);
					}}
				></textarea>
			</div>
			<Tooltip placement="left" title="remove option">
				<div className="remove-option">
					<IconButton
						className="icon"
						size="small"
						onClick={() => props.RemoveOption(props.index)}
					>
						<CancelIcon fontSize="small" />
					</IconButton>
				</div>
			</Tooltip>
		</motion.li>
	);
}

export default Option;
