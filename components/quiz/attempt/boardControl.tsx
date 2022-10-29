import React from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { Counter, Question } from "@lib/interfaces";
import Countdown, { zeroPad } from "react-countdown";
import { Modal } from "antd";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

interface Props {
  questions: Question[];
  counter: Counter;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  setCounter: React.Dispatch<React.SetStateAction<Counter>>;
}

// Random component
const Completionist = () => {
  React.useLayoutEffect(() => {
    alert("Navigated to a new page");
  }, []);

  return <span>Time up!, We will submit for you now.</span>;
};

// Renderer callback with condition
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    return <Completionist />;
  } else {
    return (
      <span className="font-bold text-yellow-900 text-lg flex-grow">
        {zeroPad(hours)} : {zeroPad(minutes)} : {zeroPad(seconds)}
      </span>
    );
  }
};

function BoardControl(props: Props) {
  const { questions, counter, setPage, page } = props;

  const handleClear = () => {
    const { destroy } = Modal.confirm({
      title: (
        <span className="flex gap-3 items-center">
          <span>Confirm</span>
        </span>
      ),
      content:
        "Are you sure you want to clear all answer, this can not be reversed",
      okText: "Clear",
      cancelText: "Cancel",
      onOk: () => {
        props.setQuestions((questions) => {
          return questions.map((question) => {
            return {
              ...question,
              options: question.options.map((option) => {
                return {
                  ...option,
                  checked: false,
                };
              }),
            };
          });
        });
        props.setCounter({
          answered: [],
          not_answered: questions.map((q) => q.key),
          not_viewed: questions.map((q) => q.key),
        });

        destroy();
      },
    });
  };

  return (
    <div className="shadow-sm p-3 quiz-board-control bg-lightgrey min-h-[350px] mb-3">
      <div className="wrap min-h-[200px]">
        <ul className="gap-2 flex flex-wrap w-[380px]">
          {questions.map((ques, key) => {
            return (
              <motion.li
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="form-group list-none"
                key={ques.key}
              >
                <Button
                  color="inherit"
                  onClick={() => setPage(key)}
                  className={
                    " w-[30px] text-xs font-bold p-2 h-max min-w-[30px] rounded-lg shadow-lg " +
                    (key == page
                      ? "bg-green text-white"
                      : counter.answered.includes(ques.key)
                      ? "bg-yellow-100"
                      : "bg-white")
                  }
                >
                  {key + 1}
                </Button>
              </motion.li>
            );
          })}
        </ul>
      </div>
      <div className="time-counter shadow-xl">
        <div className="flex flex-wrap justify-end bg-white p-3 rounded-lg gap-3 items-center">
          <span className="font-medium">Time Count: </span>
          <Countdown date={Date.now() + 75 * 60 * 1000} renderer={renderer} />
          <motion.div
            whileHover={{ scale: 1.03, y: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              color="primary"
              variant="contained"
              className="bg-green text-white rounded-lg p-2"
            >
              Submit & Finish
            </Button>
          </motion.div>
        </div>
      </div>
      <Button
        variant="text"
        color="warning"
        className="mt-4"
        onClick={handleClear}
      >
        Clear all answer
      </Button>
    </div>
  );
}

export default BoardControl;
