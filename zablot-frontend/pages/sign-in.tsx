import { Input, Button, message } from "antd";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import useFetch from "hooks/useFetch";
import { useAppDispatch } from "@lib/redux/store";
import { USER } from "@lib/redux/userSlice";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import NotAuthenticatedLayout from "@comp/NotAuthenticatedLayout";

type FormFields = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const { fetcher, fetching } = useFetch();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormFields>({});

  const submitForm = React.useCallback(async (formData: FormFields) => {
    const responseData = await fetcher<{ user: Zablot.User; token: string }>({
      method: "POST",
      url: "/auth/sign-in",
      data: formData,
    });

    if (responseData.error || !responseData.success) {
      return message.error(responseData.error || responseData.message);
    }

    router.replace("/").then(() => {
      dispatch(USER(responseData.user));
      Cookie.set("sid", responseData.token);
    });
  }, []);

  return (
    <NotAuthenticatedLayout>
      <main className="content-wrapper">
        <div className="wrapper-flex">
          <form
            action="#"
            onSubmit={handleSubmit(submitForm)}
            className="auth_form"
            data-name="login"
          >
            <div className="form_group_wrapper sign_in_wrapper">
              <div className="secondary-text">
                Let’s get you on track with your learning
              </div>
              <div className="form-group" id="email">
                <div className="form-group">
                  <Controller
                    name={"email"}
                    control={control}
                    rules={{
                      required: true,
                      pattern: {
                        value: /^[\w\.-]+@[\w\.-]+\.\w+$/,
                        message: "Please enter a valid email",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <>
                        <Input
                          type={"email"}
                          size="large"
                          bordered={false}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          aria-invalid={errors["email"] ? "true" : "false"}
                          status={errors["email"] && "error"}
                          className={
                            "form-control" +
                            (errors["email"] ? " border-red-600" : "")
                          }
                          placeholder={"Enter your email"}
                        />
                        {errors["email"] && (
                          <div className="invalid-feedback" role="alert">
                            {errors["email"]?.message ||
                              "This field is required"}
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="form-group" id="password">
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <Input.Password
                        size="large"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        status={errors.password && "error"}
                        placeholder="Enter your password*"
                        className={
                          "user-password form-control p-0 [&_input]:py-[9px] [&_input]:px-[11px]" +
                          (errors["password"] ? " border-red-600" : "")
                        }
                      />
                      {errors["password"] && (
                        <div className="invalid-feedback">
                          Password is required*
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
              <Button
                htmlType="submit"
                size="large"
                loading={fetching}
                className="btn h-auto submit_btn auth-log"
              >
                SIGN IN
              </Button>
              <p className="register-link">
                <span>Don't have an account?</span>
                <Link href="/sign-up" className="Create ml-2">
                  Create One
                </Link>
              </p>
            </div>
            <a
              href="http://localhost:8000/auth/federated/google"
              id="google"
              className="google"
            >
              <img src="/svgs/google.svg" alt="google" />
              <span>Sign in with Google</span>
            </a>
          </form>
          <div className="svg-container">
            <div className="image-wrap">
              <img src="/images/graduation-hat.png" alt="" />
            </div>
          </div>
        </div>
      </main>
    </NotAuthenticatedLayout>
  );
}
