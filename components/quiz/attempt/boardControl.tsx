import React from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { Question } from "@lib/interfaces";
import Countdown, { zeroPad } from "react-countdown";

interface Props {
  questions: Question[];
  counter: {
    [x in "answered" | "not_answered" | "not_viewed"]: string[];
  };
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
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
        <div className="flex bg-white p-3 rounded-lg gap-3 items-center">
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
    </div>
  );
}

export default BoardControl;
