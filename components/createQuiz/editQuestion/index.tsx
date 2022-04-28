import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import j from "jquery";
import { Button, Box, IconButton, Tooltip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";
import { variant } from "../uploadQuestions";

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
  setQuestion: { current: Handle };
}

// Component for editing question, will be always hidden
// when not called and after finishing editing
const EditQuestion = forwardRef((props: createInterfaceProps, ref) => {
  const { setQuestion: setRef } = props;
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>({
    question: "",
    options: [{ text: "", checked: false }],
  });
  const [questionId, setQuestionId] = useState<number>(null);
  const [open, setOpen] = useState<boolean>(false);
  const scrollTop = useRef<HTMLDivElement>(null);
  useImperativeHandle(
    ref,
    () => ({
      setQuestionToEdit(id: number, question?: Question) {
        setQuestionToEdit(() => question);
        setQuestionId(id);
        j(scrollTop.current).prop("scrollTop", "0");
        setOpen(true);
      },
    }),
    []
  );

  return (
    <div className="edit-question">
      <AnimatePresence exitBeforeEnter={true} initial={false}>
        {open && (
          <Content
            questionToEdit={questionToEdit}
            setOpen={setOpen}
            questionId={questionId}
            setRef={setRef}
            scrollTop={scrollTop}
          />
        )}
      </AnimatePresence>
    </div>
  );
});
EditQuestion.displayName = "Edit Question";

interface ContentInterface {
  questionToEdit: Question | null;
  questionId: number;
  setRef: createInterfaceProps["setQuestion"];
  setOpen(action: boolean): void;
  scrollTop: React.MutableRefObject<HTMLDivElement>;
}

function Content(props: ContentInterface) {
  const {
    questionToEdit: edit,
    questionId: id,
    setRef,
    setOpen,
    scrollTop,
  } = props;

  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(edit);
  const [questionId, setQuestionId] = useState<number>(id);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loaded, setLoaded] = useState(false);
  const [toggled, setToggled] = useState(false);

  function showSnackbar(message: string, variant?: "error" | "success") {
    enqueueSnackbar(message, {
      anchorOrigin: {
        vertical: variant === "success" ? "bottom" : "top",
        horizontal: "center",
      },
      variant: variant,
      autoHideDuration: 3000,
    });
  }

  const AddOptions = (): void => {
    let option = {
      text: "",
      checked: false,
      isNew: true,
    };
    setQuestionToEdit((oldState): Question => {
      // removing isNew from old options to trigger the correct animation
      let oldOptions = oldState.options.map((option) => {
        delete option.isNew;
        return option;
      });
      const options: Option[] = [...oldOptions, ...[option]];
      return { ...oldState, ...{ options } };
    });
  };

  const HandleQuestionTextChange = (e: React.ChangeEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement;
    setQuestionToEdit({ ...questionToEdit, ...{ question: target.value } });
  };

  const HandleOptionTextChange = (
    e: React.ChangeEvent<HTMLElement>,
    optionIndex: number
  ) => {
    const target = e.target as HTMLInputElement;
    setQuestionToEdit((oldState): Question => {
      const options: Option[] = oldState.options.map((option, index) => {
        if (option?.isNew) delete option.isNew;
        if (index === optionIndex) option.text = target.value;
        return option;
      });
      const newState = { ...oldState, ...{ options } };
      return newState;
    });
  };

  const HandleAnswerChecked = (optionIndex: number) => {
    setQuestionToEdit((oldState): Question => {
      const newOptions: Option[] = oldState.options.map((option, index) => {
        if (option?.isNew) delete option.isNew;
        option.checked = false;

        if (index === optionIndex) option.checked = true;
        return option;
      });
      const newState = { ...oldState, ...{ options: newOptions } };
      return newState;
    });
  };

  const RemoveOption = (optionIndex: number) => {
    if (questionToEdit.options.length < 3) {
      showSnackbar("Sorry the Mininum option is 2", "error");
      return;
    }
    setQuestionToEdit((oldState): Question => {
      const newOptions: Option[] = oldState.options.filter((option, index) => {
        if (option?.isNew) delete option.isNew;
        return index !== optionIndex;
      });
      const newState = { ...oldState, ...{ options: newOptions } };
      return newState;
    });
  };

  const SubmitQuestion = () => {
    if (!Boolean(questionToEdit.question)) {
      showSnackbar("Add Question Please", "error");
      return;
    }

    let notEmptyOption = 0;
    let isAnyOptionChecked = false;
    questionToEdit.options.map((option) => {
      if (option.text) notEmptyOption++;
      if (option.checked) isAnyOptionChecked = true;
    });

    if (notEmptyOption < 2) showSnackbar("Sorry minimum options is 2", "error");
    else if (!isAnyOptionChecked)
      showSnackbar("Sorry you need to check the correct option", "error");
    else
      setRef.current.setQuestions(questionToEdit, questionId), setOpen(false);
  };

  const SetDefaultState = () => {
    setQuestionToEdit((state) => {
      return {
        question: "",
        options: [
          { text: "", checked: false },
          { text: "", checked: false },
        ],
      };
    });
  };
  return (
    <motion.div
      initial={{ opacity: 0.8 }}
      exit={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      className="backdrop"
    >
      <motion.div
        variants={variant}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="edit-wrap form-container question-form"
        id="question-form"
        ref={scrollTop}
        aria-describedby="question-form-label"
      >
        <div className="header">
          <div className="title">Question {questionId + 1} Edit</div>
          <motion.button
            className="close-btn modal"
            onClick={() => setOpen(!open)}
            whileTap={{ scale: 0.9 }}
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgb(53,163,180)",
              color: "rgb(255,255,255)",
            }}
          >
            <span>Close</span>
          </motion.button>
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
              value={questionToEdit.question}
              onChange={HandleQuestionTextChange}
              placeholder="Enter your question.."
            />
          </div>
          <div className="options-wrap">
            <div className="header">
              <div className="title">Options</div>
              {questionToEdit.options.length < 4 && (
                <Tooltip title="Add options" placement="left">
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
              <ul className="option-list-container" role="list">
                <AnimatePresence>
                  {questionToEdit.options.map(
                    (option: Option, index: number) => {
                      return (
                        <div key={index} className="option" role="listitem">
                          <motion.div
                            className="text-box"
                            animate={{
                              height: 40,
                              boxShadow: "0px 2px 7px rgb(182,182,182)",
                            }}
                            initial={{
                              height: 0,
                              boxShadow: "0px 0px 0px whitesmoke",
                            }}
                            exit={{
                              height: 0,
                              boxShadow: "0px 0px 0px whitesmoke",
                            }}
                          >
                            <input
                              type="checkbox"
                              name="radio-input"
                              checked={option.checked}
                              onChange={() => HandleAnswerChecked(index)}
                              className="answer checkbox"
                              id="answer"
                            />
                            <textarea
                              name="option-input"
                              id=""
                              value={option.text}
                              onChange={(e) => HandleOptionTextChange(e, index)}
                              placeholder="Enter option"
                              className="text-control textarea"
                            ></textarea>
                            <IconButton
                              size="small"
                              onClick={() => RemoveOption(index)}
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
            <Button className="create-btn btn" onClick={SubmitQuestion}>
              Update
            </Button>
            <Button className="reset-btn btn" onClick={SetDefaultState}>
              Reset
            </Button>
          </div>
        </Box>
      </motion.div>
    </motion.div>
  );
}
export default EditQuestion;
