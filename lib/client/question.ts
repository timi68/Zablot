/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { nanoid } from "@reduxjs/toolkit";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import { Option, Question, MessageType } from "@types";

interface QCT {
  setter: Setter;
  readonly caller: "poll" | "quiz" | "question";
  enqueueSnackbar: (
    message: SnackbarMessage,
    options?: OptionsObject
  ) => SnackbarKey;
  showSnackbar(message: string, variant?: "error" | "success"): void;
}

type Setter = (value: React.SetStateAction<Question | MessageType>) => void;

class QuestionController implements QCT {
  caller: QCT["caller"];
  enqueueSnackbar: QCT["enqueueSnackbar"];
  setter: Setter;
  question: Question | MessageType;
  questionDefault: Question | MessageType;
  options: OptionsObject = {
    anchorOrigin: {
      horizontal: "center",
      vertical: "bottom",
    },
  };

  constructor(
    caller: QCT["caller"],
    snack: QCT["enqueueSnackbar"],
    setter: Setter,
    options?: OptionsObject
  ) {
    this.caller = caller;
    this.enqueueSnackbar = snack;
    this.setter = setter;
    setter((question) => {
      this.question = question;
      this.questionDefault = question;

      return question;
    });

    if (options) {
      this.options = options;
    }
  }

  showSnackbar(message: string, variant?: "error" | "success") {
    this.enqueueSnackbar(message, {
      ...this.options,
      variant: variant,
      autoHideDuration: 2000,
    });
  }

  AddOptions() {
    let option: Option = {
      key: nanoid(),
      text: "",
      checked: false,
    };

    this.setter((question) => {
      // removing isNew from old options to trigger the correct animation
      const options = [...question.options, option];
      this.question = { ...question, options };
      return { ...question, options };
    });
  }

  questionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const target = e.target;
    this.setter((question) => {
      this.question = { ...question, question: target.value };
      return { ...question, question: target.value };
    });
  }

  optionChange(e: React.ChangeEvent<HTMLTextAreaElement>, key: string) {
    const target = e.target;
    this.setter((question) => {
      const options = question.options.map((option) => {
        if (option.key === key) {
          return { ...option, text: target.value };
        }
        return option;
      });
      this.question = { ...question, options };
      return { ...question, options };
    });
  }

  answerChecked(key: string) {
    this.setter((question) => {
      const options = question.options.map((option, index) => {
        return { ...option, checked: option.key == key };
      });

      this.question = { ...question, options };
      return { ...question, options };
    });
  }

  removeOption(key: string) {
    this.setter((question) => {
      if (question.options.length < 3) {
        this.showSnackbar("Sorry the Minimum option is 2", "error");
        return question;
      }
      const options = question.options.filter((option) => option.key !== key);
      this.question = { ...question, options };
      return { ...question, options };
    });
  }

  setDefault() {
    if (this.caller === "question") {
      this.questionDefault = this.question;
      return;
    }
    this.setter(() => {
      let _default: Question | MessageType = {
        ...this.questionDefault,
        ...(!["question", "poll"].includes(this.caller)
          ? { key: nanoid() }
          : {}),
        options: [
          { text: "", checked: false, key: nanoid() },
          { text: "", checked: false, key: nanoid() },
        ],
      };

      this.question = _default;
      this.questionDefault = _default;
      return _default;
    });
  }

  submitQuestion(callback: () => void) {
    if (!Boolean(this.question.question)) {
      this.showSnackbar("Add Question Please", "error");
      return;
    }

    let notEmptyOption = 0;
    let EmptyOption = 0;
    let isAnyOptionChecked = false;
    this.question.options.map((option) => {
      if (option.text) notEmptyOption++;
      else EmptyOption++;
      if (option.checked) isAnyOptionChecked = true;
    });

    if (notEmptyOption < 2)
      this.showSnackbar("Sorry the minimum option is 2", "error");
    else if (EmptyOption > 0)
      this.showSnackbar("Please remove empty options", "error");
    else if (!isAnyOptionChecked)
      this.showSnackbar("Sorry you need to check the correct option", "error");
    else callback(), this.setDefault();
  }

  clearChanges() {
    this.question = this.questionDefault;
    this.setter(this.questionDefault);
  }
}

function useController(
  caller: QCT["caller"],
  snack: QCT["enqueueSnackbar"],
  setter: Setter,
  options?: OptionsObject
): QuestionController {
  const [controller, setController] = React.useState(null);
  React.useEffect(() => {
    setController(new QuestionController(caller, snack, setter, options));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return controller;
}

export default useController;
