import { useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Layout from "../../src/AppLayout";
import { Box } from "@mui/system";
import { useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSnackbar } from "notistack";
import Slide from "@mui/material/Slide";
import { AppContext } from "../../lib/context";
import { ActionType } from "../../lib/interfaces";
import cookie from "js-cookie";
import webtoken from "jsonwebtoken";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  FilledInput,
  InputAdornment,
  InputLabel,
  CircularProgress,
  Typography,
} from "@mui/material";

function Login({ secret }) {
  const router = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const { dispatch } = useContext(AppContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const handleClickShowPassword = () => {
    setShow(!show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  interface FormInterface {
    Email: string;
    Password: string;
  }

  const submitForm = async (data: FormInterface): Promise<void> => {
    if (requestLoading) return;
    try {
      if (!requestLoading && !loggedIn) {
        setRequestLoading(true);
        const sendFormData = await axios.post("/api/users/login", data);
        setRequestLoading(false);

        enqueueSnackbar(sendFormData.data?.message, {
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          variant: sendFormData.data?.success ? "success" : "error",
          TransitionComponent: Slide,
          autoHideDuration: 3000,
        });

        if (Boolean(sendFormData.data?.success)) {
          setLoggedIn(true);
          let user = sendFormData.data.user;
          user.Notifications = user.Notifications[0].notifications;
          user.Friends = user.Friends[0].friends;
          user.FriendRequests = user.FriendRequests[0].requests;
          user.Settings = user.Settings[0].settings;

          var userCookie = { user: user._id };
          console.log(secret, "from secret");
          const token = webtoken.sign(userCookie, secret, {
            expiresIn: "30d",
          });

          console.log(token);

          cookie.set("user", JSON.stringify(token));
          dispatch({
            type: ActionType.LOGGEDIN,
            payload: { user, loggedIn: true },
          });

          router.replace("/dashboard");
          return;
        }
      }
    } catch (err) {
      setRequestLoading(false);
      enqueueSnackbar(err.message + ";\nCheck your connection", {
        variant: "error",
      });
    }
  };

  return (
    <Layout title="Login Page" text="Sign Up" href="/register" loggedIn={false}>
      <Box
        component="form"
        onSubmit={handleSubmit(submitForm)}
        sx={{
          display: "block",
          maxWidth: "90vw",
          width: 600,
          height: "auto",
          maxHeight: "100%",
          overflow: "auto",
          mx: "auto",
        }}
      >
        <Typography
          component="h3"
          variant="h6"
          textAlign="center"
          m={3}
          fontWeight="bold"
          color="primary"
        >
          Login
        </Typography>
        <FormControl
          variant="filled"
          fullWidth
          sx={{ display: "block", my: 2, bgcolor: "secondary" }}
          error={errors?.Email ? true : false}
        >
          <InputLabel htmlFor="standard-adornment-email">
            Enter your email *
          </InputLabel>
          <FilledInput
            fullWidth
            id="standard-adornment-email"
            type="email"
            sx={{ bgcolor: "grey" }}
            {...register("Email", {
              required: "true",
              pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            })}
          />
          <FormHelperText>
            {errors?.Email?.type === "required"
              ? "Please Enter Your Email"
              : errors?.Email?.type === "pattern"
              ? "Email not valid"
              : null}{" "}
          </FormHelperText>
        </FormControl>
        <FormControl
          fullWidth
          sx={{ display: "block", my: 2 }}
          variant="filled"
          error={errors?.Password ? true : false}
        >
          <InputLabel htmlFor="standard-adornment-password">
            Password
          </InputLabel>
          <FilledInput
            fullWidth
            id="standard-adornment-password"
            type={show ? "text" : "password"}
            {...register("Password", {
              required: true,
              minLength: 4,
            })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText>
            {errors?.Password?.type === "required"
              ? "Please Enter Your Password"
              : errors?.Password?.type === "minLength"
              ? "Password length must be greater than 8"
              : null}{" "}
          </FormHelperText>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          size="medium"
          sx={{
            my: 2,
            width: 200,
          }}
        >
          {requestLoading || loggedIn ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 2 }} />
              {loggedIn ? "Redirecting..." : "Submitting..."}
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </Box>
    </Layout>
  );
}

export async function getStaticProps() {
  console.log(process.env.SALT);
  return {
    props: {
      secret: process.env.SALT,
    },
  };
}

export default Login;
