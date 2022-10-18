import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useCallback,
  Fragment,
  useRef,
} from "react";
import { useSnackbar } from "notistack";
import * as Interfaces from "@lib/interfaces";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { CircularProgress } from "@mui/material";
import { jsPDF } from "jspdf";
import Cookie from "js-cookie";
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
import { useAppSelector } from "@lib/redux/store";

export const variant = {
  hidden: {
    scale: 0.6,
    opacity: 0.6,
    borderRadius: "50%",
  },
  visible: {
    scale: 1,
    opacity: 1,
    borderRadius: "3%",
  },
  exit: {
    scale: 0.3,
    opacity: 0,
    borderRadius: "50%",
  },
};

const Styles = {
  mainContent: {
    width: "210px",
    margin: "auto",
    padding: "10px 10px 0px 10px",
    overflow: " hidden",
    background: "#fff",
    fontSize: "11px",
    height: "295px",
  },
  title: {
    fontWeight: 300,
    fontSize: "5px",
    color: "grey",
  },
  headerTitle: {
    marginBottom: "5px",
    fontSize: "10px",
    textAlign: "center",
    color: "grey",
  },
  card: {
    background: "whitesmoke",
    boxShadow: "0px 2px 7px rgb(182,182,182)",
    padding: "5px",
    borderRadius: "2px",
    width: "100%",
    marginBottom: "5px",
  },
  text: {
    fontSize: "4px",
  },
};

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
  closeTime?: string | null;
  openTime?: string | null;
  type: string;
  password?: string;
  quizId: string;
  duration: number;
  purpose?: string;
}
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
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => null}>
        {open && (
          <motion.div
            initial={{ opacity: 0.8 }}
            exit={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            className="backdrop"
          >
            {/* <CircularProgress color="inherit" /> */}
            <motion.div
              variants={variant}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="upload-wrapper"
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

function Content({ questions, setOpen }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<Form<string>>({
    Duration: "",
    QuizName: "",
    CloseTime: "",
    OpenTime: "",
    Purpose: "",
    Password: "",
    QuizType: "Public",
  });
  const { FullName } = useAppSelector((state) => state.sessionStore.user);
  const Doc = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Form<boolean>>(null);
  const [show, setShow] = useState<boolean>(false);
  const [IsUploading, setIsUploading] = useState<boolean>(false);
  const [quizUploadedDetails, setQuizUploadedDetails] =
    useState<quizDetailsInterface>();

  const Time = (newValue: string, name: "OpenTime" | "CloseTime") => {
    setFormData({ ...formData, ...{ [name]: newValue } });
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
    setFormData({ ...formData, ...{ [target.name]: target.value } });
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
        Object.assign(errors, { Duration: true });
      if (!Boolean(formData.QuizName))
        Object.assign(errors, { QuizName: true });
      if (!Boolean(formData.Purpose)) Object.assign(errors, { Purpose: true });
      if (!Boolean(new Date(formData.OpenTime)))
        Object.assign(errors, { OpenTime: true });
      if (!Boolean(new Date(formData.CloseTime)))
        Object.assign(errors, { CloseTime: true });
      if (formData.QuizType === "private") {
        if (!Boolean(formData.Password))
          Object.assign(errors, { Password: true });
      }

      if (Object.keys(errors)?.length) {
        setErrors(errors);
        return;
      }

      setIsUploading(true);
      Object.assign(formData, { name: FullName, Questions: questions });

      try {
        const response = await axios.post("/api/quiz/upload", formData);

        setQuizUploadedDetails({
          name: FullName,
          quizName: formData.QuizName,
          quizId: response.data.id,
          questionsLength: questions.length,
          duration: formData.Duration as unknown as number,
          openTime: new Date(formData.OpenTime).toLocaleString() ?? null,
          closeTime: new Date(formData.CloseTime).toLocaleString() ?? null,
          type: formData.QuizType,
          password: formData.Password,
          purpose: formData.Purpose,
        });
        Cookie.remove("Questions");
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

  const Print = () => {
    const pdf = new jsPDF();
    //@ts-ignore

    pdf.html(Doc.current, {
      callback: (doc) => {
        alert("about to download");
        doc.save(formData.QuizName + "@" + new Date().toLocaleString());
      },
      x: 0,
      y: 0,
    });
  };

  if (quizUploadedDetails) {
    return (
      <div className="details-container">
        <div className="details-wrapper">
          <div
            className="hidden-details pdf-format"
            ref={Doc}
            // @ts-ignore
            style={Styles.mainContent}
          >
            <div className="header">
              <div
                className="title"
                //@ts-ignore
                style={Styles.headerTitle}
              >
                Quiz Details
              </div>
            </div>
            <div className="uploader-name card" style={Styles.card}>
              <div className="title" style={Styles.title}>
                Uploader name
              </div>
              <div className="text" style={Styles.text}>
                {quizUploadedDetails.name}
              </div>
            </div>
            <div className="quiz-id card" style={Styles.card}>
              <div className="title" style={Styles.title}>
                Quiz id
              </div>
              <div className="text" style={Styles.text}>
                {quizUploadedDetails.quizId}
              </div>
            </div>
            <div className="quiz_name card" style={Styles.card}>
              <div className="title" style={Styles.title}>
                Quiz name
              </div>
              <div className="text" style={Styles.text}>
                {quizUploadedDetails.quizName}
              </div>
            </div>
            <div className="questions-length card" style={Styles.card}>
              <div className="title" style={Styles.title}>
                Questions length
              </div>
              <div className="text" style={Styles.text}>
                {quizUploadedDetails.questionsLength} Questions to attempt
              </div>
            </div>
            <div className="open-time card" style={Styles.card}>
              <div className="title" style={Styles.title}>
                Open time
              </div>
              <div className="text" style={Styles.text}>
                {quizUploadedDetails?.openTime ?? "Opened"}
              </div>
            </div>
            <div className="close-time card" style={Styles.card}>
              <div className="title" style={Styles.title}>
                Close time
              </div>
              <div className="text" style={Styles.text}>
                {quizUploadedDetails?.closeTime ?? "always opened"}
              </div>
            </div>
            <div className="password card" style={Styles.card}>
              <div className="title" style={Styles.title}>
                Password
              </div>
              <div className="text" style={Styles.text}>
                {quizUploadedDetails?.password ?? "always opened"}
              </div>
            </div>
            <div className="purpose card" style={Styles.card}>
              <div className="title" style={Styles.title}>
                Purpose
              </div>
              <div className="text" style={Styles.text}>
                {quizUploadedDetails?.purpose}
              </div>
            </div>
          </div>
          <div className="main-content wrapper">
            <div className="header">
              <div className="title">Quiz Details</div>
            </div>
            <div className="uploader-name card">
              <div className="title">Uploader name</div>
              <div className="text">{quizUploadedDetails.name}</div>
            </div>
            <div className="quiz-id card">
              <div className="title">Quiz id</div>
              <div className="text">{quizUploadedDetails.quizId}</div>
            </div>
            <div className="quiz_name card">
              <div className="title">Quiz name</div>
              <div className="text">{quizUploadedDetails.quizName}</div>
            </div>
            <div className="questions-length card">
              <div className="title">Questions length</div>
              <div className="text">
                {quizUploadedDetails.questionsLength} Questions to attempt
              </div>
            </div>
            <div className="open-time card">
              <div className="title">Open time</div>
              <div className="text">
                {quizUploadedDetails?.openTime ?? "Opened"}
              </div>
            </div>
            <div className="close-time card">
              <div className="title">Close time</div>
              <div className="text">
                {quizUploadedDetails?.closeTime ?? "always opened"}
              </div>
            </div>
            <div className="password card">
              <div className="title">Password</div>
              <div className="text">
                {quizUploadedDetails?.password ?? "always opened"}
              </div>
            </div>
          </div>
        </div>
        <div className="button-wrap">
          <motion.button
            className="btn finish"
            whileHover={{ scale: 1.1 }}
            onClick={Print}
          >
            Print Details
          </motion.button>
          <motion.button
            className="btn close"
            whileHover={{ scale: 1.1 }}
            onClick={() => setOpen(false)}
          >
            Close
          </motion.button>
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

  const sx = {
    "& .MuiInputLabel-root": {
      fontWeight: 500,
      fontSize: "0.8em",
      top: "3px",
      maxWidth: "fit-content",
      "&.Mui-focused": {
        left: "10px",
        // transform: "translateX(-50%)",
      },
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "50px !important",
    },
  };
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
              className="text-control"
              size="small"
              sx={sx}
              autoComplete="new-quiz-name"
              autoCapitalize="true"
              helperText={
                formData?.QuizName && "The name or subject of the quiz"
              }
            />
            <TextField
              fullWidth
              error={errors?.Purpose}
              className="text-control"
              label="Quiz purpose*"
              size="small"
              margin="dense"
              name="Purpose"
              value={formData?.Purpose ?? ""}
              onChange={handleChange}
              autoComplete="new-purpose"
              variant="outlined"
              sx={sx}
              helperText={formData?.Purpose && "The purpose of the quiz (Any)"}
            />
            <TextField
              fullWidth
              error={errors?.Duration}
              label="Duration (measure in mins)*"
              margin="dense"
              size="small"
              autoComplete="new-duration"
              name="Duration"
              className="text-control"
              variant="outlined"
              sx={sx}
              value={formData?.Duration ?? ""}
              onChange={handleChange}
              helperText={
                errors?.Duration &&
                "Time to be use to attempt the quiz: example "
              }
            />
            <TextField
              fullWidth
              type="text"
              name="QuizType"
              select
              className="text-control"
              size="small"
              margin="dense"
              autoComplete="new-type"
              onChange={handleChange}
              value={formData?.QuizType ?? "Public"}
              error={errors?.QuizType}
              sx={sx}
            >
              <MenuItem value="Private">Private</MenuItem>
              <MenuItem value="Public">Public</MenuItem>
            </TextField>
            {formData?.QuizType === "Private" && (
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ my: ".5em", ...sx }}
                error={errors?.Password}
                size="small"
                className="text-control"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  fullWidth
                  id="outlined-adornment-password"
                  error={errors?.Password}
                  name="Password"
                  size="small"
                  autoComplete="new-password"
                  type={show ? "text" : "password"}
                  value={formData?.Password ?? ""}
                  onChange={handleChange}
                  sx={sx}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {show ? <VisibilityOff /> : <Visibility />}
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
            )}
            <div className="additional-fields">
              <div className="title">
                <div className="text">Additional options</div>
              </div>
              <div className="time-wrapper">
                <TextField
                  fullWidth
                  name="OpenTime"
                  margin="dense"
                  size="small"
                  type="datetime-local"
                  onChange={handleChange}
                  sx={sx}
                />
                <TextField
                  fullWidth
                  name="CloseTime"
                  margin="dense"
                  size="small"
                  type="datetime-local"
                  onChange={handleChange}
                  sx={sx}
                />
              </div>
            </div>
          </div>

          <div className="button-wrap">
            <motion.button className="btn finish" whileHover={{ scale: 1.1 }}>
              Finish
            </motion.button>
            <motion.button
              className="btn close"
              whileHover={{ scale: 1.1 }}
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
