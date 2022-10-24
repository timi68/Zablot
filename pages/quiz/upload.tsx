import React from "react";
import { useSnackbar } from "notistack";
import * as Interfaces from "@lib/interfaces";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  CircularProgress,
  Collapse,
  Divider,
  Skeleton,
  TextFieldProps,
  Tooltip,
  Zoom,
} from "@mui/material";
import { jsPDF } from "jspdf";
import Cookie from "js-cookie";
import { TextField, MenuItem, IconButton, Grid } from "@mui/material";
import { useAppSelector } from "@lib/redux/store";
import { getQuestions } from "@lib/redux/questionSlice";
import getUser from "@lib/getUser";
import FetchUser from "@lib/fetch_user";
import { NextRouter, useRouter } from "next/router";
import { useAppDispatch } from "@lib/redux/store";
import CreatedQuestion from "@comp/quiz/createdQuestion";
import j from "jquery";
import { Checkbox, DatePicker, Space, Input, Select, TimePicker } from "antd";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import moment from "moment";
import { marked } from "marked";
import { useForm } from "react-hook-form";

const { Option } = Select;

const children: React.ReactNode[] = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

type FieldValue = string | string[] | number[] | boolean | number;
type FieldName =
  | "password"
  | "visibility"
  | "categories"
  | "description"
  | "title"
  | "duration"
  | "monitor"
  | "range";
type Fields = Partial<{ [x in FieldName]: FieldValue }>;
type FieldsError = Partial<{ [x in FieldName]: boolean }>;

const UploadQuestion = (props: { user: string }) => {
  const questions = useAppSelector((state) => getQuestions(state));
  const [type, setShow] = React.useState("password");
  const user = useAppSelector((state) => state.sessionStore.user);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const router: NextRouter = useRouter();
  const [fields, setFields] = React.useState<Fields>({});
  const [errors, setErrors] = React.useState<FieldsError>({});

  React.useEffect(() => {
    !user && FetchUser(dispatch, enqueueSnackbar, props.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Description = React.useMemo(() => {
    return <DescriptionComponent />;
  }, []);

  if (!user) {
    return (
      <Box p="2em" className="flex-grow">
        <div className="grid gap-3">
          <Skeleton height="50px" width="100%" />
          <Skeleton height="50px" width="40%" />
          <Skeleton height="50px" width="60%" />
        </div>
      </Box>
    );
  }

  const handleChange = (name: FieldName, value: FieldValue) => {
    setFields({ ...fields, [name]: value });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    let errors: FieldsError = {};

    const requiredFields = ["visibility", "title", "categories", "duration"];
    for (const field in Object.entries(fields)) {
      if (!field[1] && requiredFields.includes(field[0])) {
        errors[field[0]] = true;
      }
    }

    if (Object.keys(errors).length) {
      setErrors(errors);
      return;
    }

    console.log({ fields });
  };

  return (
    <React.Fragment>
      <div className="upload-question p-2 flex-grow h-full overflow-auto">
        <div className="upload-wrapper sm:max-w-[90%] mx-auto">
          <div className="header save-header flex p-2 justify-between">
            <div className="text">
              <div className="primary uppercase font-extrabold text-xl font-[nunito,poppins,calibri]">
                Lets Get It Up
              </div>
              <div className="text-sm">
                We need to collection few details to your quiz for
                identification
              </div>
            </div>
            <Tooltip title="Go back to create page" placement="bottom">
              <motion.div
                whileHover={{ scale: 0.9 }}
                className="relative bg-green h-[30px] w-[30px] rounded-3xl"
              >
                <motion.button
                  onClick={() => router.back()}
                  whileHover={{ x: -10 }}
                  whileTap={{ x: -20 }}
                >
                  <KeyboardBackspaceRoundedIcon
                    fontSize="large"
                    className="ml-[5px] mt-[-2px] text-white"
                  />
                </motion.button>
              </motion.div>
            </Tooltip>
          </div>
          <Divider className="my-3">
            <span className="text-xs">
              This is important to your quiz, fill carefully
            </span>
          </Divider>
          <form
            action="#"
            className="form-group"
            autoComplete="off"
            onSubmit={submit}
          >
            <div className="form-wrapper">
              <TextField
                {...generateProps("Title")}
                onChange={(e) => handleChange("title", e.target.value)}
              />
              {Description}
              <Grid container spacing={{ xs: 2 }} sx={{ py: 2 }}>
                <Grid item xs={12} sm={6}>
                  <span className="text-xs font-medium">
                    helperText: Duration time of the quiz
                  </span>
                  <TimePicker
                    placeholder="Duration of the quiz"
                    size="large"
                    minuteStep={15}
                    className="w-full shadow-lg"
                    format={"HH:mm"}
                    showNow={false}
                    status={errors.duration ? "error" : undefined}
                    onChange={(e) =>
                      handleChange("duration", [e.hours(), e.minutes()])
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <span className="text-xs font-medium">
                    if public, means anyone can make use of it
                  </span>
                  <Select
                    className="w-full shadow-lg"
                    size={"large"}
                    placeholder="Select visibility"
                    status={errors.visibility ? "error" : undefined}
                    onChange={(e) => handleChange("visibility", e)}
                  >
                    <Option value="public">Public</Option>
                    <Option value="private">Private</Option>
                  </Select>
                </Grid>
              </Grid>
              {fields.visibility == "private" && (
                <Collapse
                  in={true}
                  className="bg-white p-2 rounded-lg shadow-lg mb-2"
                >
                  <Input.Password
                    placeholder="Enter security key"
                    className="w-full"
                    status={errors.password ? "error" : undefined}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </Collapse>
              )}
              <div className="wrap">
                <span className="text-xs font-medium">
                  You can still edit the accessible state later
                </span>
                <DatePicker.RangePicker
                  showTime
                  ranges={{
                    Today: [moment(), moment()],
                    "7 days Time": [moment(), moment().add(7, "days")],
                    "This Month": [
                      moment().startOf("month"),
                      moment().endOf("month"),
                    ],
                  }}
                  size={"large"}
                  name="time-range"
                  status={errors.range ? "error" : undefined}
                  className="w-full shadow-lg"
                  onChange={(e) =>
                    handleChange(
                      "range",
                      e.map((d) => d.toISOString())
                    )
                  }
                />
              </div>
              <div className="form-group my-4">
                <span className="text-xs font-medium">
                  Categories let students find your quiz easily and fast.
                </span>
                <Select
                  showSearch
                  mode="multiple"
                  allowClear
                  size="large"
                  className="w-full shadow-lg"
                  placeholder="Categories"
                  defaultValue={["a10", "c12"]}
                  status={errors.categories ? "error" : undefined}
                  onChange={(e) => handleChange("categories", e)}
                >
                  {children}
                </Select>
              </div>
              <Checkbox
                className="mt-5"
                onChange={(e) => handleChange("monitor", e.target.checked)}
              >
                Watch Student While Attempting The Quiz
              </Checkbox>
            </div>

            <div className="button-wrap">
              <motion.button
                {...buttonProps("bg-green text-white my-5 w-max p-4 ")}
                type="submit"
              >
                Done & Upload!
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

let key = 0;
const DescriptionComponent = () => {
  const [preview, setPreview] = React.useState(false);
  const [value, setValue] = React.useState("");
  // const [key, setkey] = React.useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    setValue(value);
  };

  return (
    <div className="description  rounded-lg shadow-xl overflow-hidden my-3">
      <div className="font-semibold text-base p-2 bg-lightgrey">
        Description
      </div>
      <div className="toggle-list p-[12px_12px_0px] flex gap-x-4">
        <motion.button
          onClick={() => (key++, setPreview(false))}
          {...buttonProps(
            !preview
              ? "text-white bg-slate-700 "
              : "border-none ring-1 ring-slate-700 text-slate-700 "
          )}
        >
          Write
        </motion.button>
        <motion.button
          {...buttonProps(
            preview
              ? "text-white bg-slate-700 "
              : "border-none ring-1 ring-slate-700 text-slate-700 "
          )}
          onClick={() => (key++, setPreview(true))}
        >
          Preview
        </motion.button>
      </div>
      <div className="form-group p-3">
        <AnimatePresence mode="popLayout">
          {!preview ? (
            <motion.div
              key={key}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Input.TextArea
                showCount
                onChange={handleChange}
                maxLength={2000}
                value={value}
                aria-label="quiz description"
                name="description"
                id="desc"
                className="h-[200px] after:mt-3 after:content-[attr(data-count)] w-full [&_textarea]:rounded-lg"
              />
            </motion.div>
          ) : (
            <motion.div
              key={key}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ opacity: 0 }}
              className="preview min-h-[200px] rounded-lg bg-white p-8"
              dangerouslySetInnerHTML={{ __html: marked.parse(value) }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const generateProps = (label: string, type?: string): TextFieldProps => {
  return {
    size: "medium",
    type: type ?? "text",
    fullWidth: true,
    margin: "dense",
    className: "text-control shadow-lg",
    variant: "outlined",
    label,
    autoComplete: "____name___",
  };
};

const buttonProps = (className: string): HTMLMotionProps<"button"> => ({
  type: "button",
  className:
    className +
    "text-sm font-semibold rounded-lg p-2 min-w-[80px] grid items-center text-center shadow-lg",
  whileTap: { scale: 0.8 },
  whileHover: { scale: 1.05 },
});

export async function getServerSideProps({ req, res }) {
  try {
    const user_id = req.session.user;
    if (!user_id) throw new Error("There is no session");

    const user = await getUser(user_id);
    if (!user) throw new Error("User not found");

    return {
      props: { user: JSON.stringify(user) },
    };
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
}

export default UploadQuestion;
