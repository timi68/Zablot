import PropTypes from "prop-types";
import React, { Component } from "react";
import { Button, Input, Select, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import Validator from "global_validator";
import { PasswordReturnType } from "global_validator/dist/lib/types";
import Link from "next/link";
import { USER } from "@lib/redux/userSlice";
import useFetch from "hooks/useFetch";
import { useRouter } from "next/router";
import NotAuthenticatedLayout from "@comp/NotAuthenticatedLayout";

type FormFields = {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  password: string;
};

const SERVER_URL = process.env.SERVER_URL;

export default function SignUpPage() {
  const { fetcher, fetching } = useFetch();
  const router = useRouter();
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<FormFields>({});

  const submitForm = React.useCallback(async (formData: FormFields) => {
    const responseData = await fetcher<{ user: Zablot.User }>({
      method: "POST",
      url: "/auth/sign-up",
      data: formData,
    });

    if (responseData.error || !responseData.success) {
      return message.error(responseData.error || responseData.message);
    }

    router.replace("/sign-in");
    message.success(responseData.message, 3);
    reset({});
  }, []);

  // console.log({ errors });

  const InputControl = (options: {
    name: keyof FormFields;
    placeholder: string;
    type?: string;
    invalidText?: string;
  }) => {
    return (
      <div className="form-group">
        <Controller
          name={options.name}
          control={control}
          rules={{
            required: true,
            pattern:
              options.type == "email"
                ? {
                    value: /^[\w\.-]+@[\w\.-]+\.\w+$/,
                    message: "Please enter a valid email",
                  }
                : undefined,
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <>
              <Input
                type={options.type ?? "text"}
                size="large"
                bordered={false}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                aria-invalid={errors[options.name] ? "true" : "false"}
                status={errors[options.name] && "error"}
                className={
                  "form-control" +
                  (errors[options.name] ? " border-red-600" : "")
                }
                placeholder={options.placeholder}
              />
              {errors[options.name] && (
                <div className="invalid-feedback" role="alert">
                  {errors[options.name]?.message || "This field is required"}
                </div>
              )}
            </>
          )}
        />
      </div>
    );
  };

  return (
    <NotAuthenticatedLayout>
      <main className="main-content">
        <div className="wrapper-flex">
          <form
            action="#"
            onSubmit={handleSubmit(submitForm)}
            className="auth_form"
            data-name="register"
            autoComplete="off"
          >
            <div className="form_group_wrapper sign_in_wrapper">
              <div className="secondary-text">
                Let’s give a material you can trust, strictly for education
              </div>
              {InputControl({
                name: "firstName",
                placeholder: "Enter your first name",
              })}
              {InputControl({
                name: "lastName",
                placeholder: "Enter your last name",
              })}
              {InputControl({
                name: "email",
                placeholder: "Enter a your email",
                type: "email",
                invalidText: "Please enter a valid email",
              })}
              <div className="form-group" id="gender">
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onBlur, value } }) => (
                    <>
                      <Select
                        placeholder="Select gender"
                        size="large"
                        bordered={false}
                        className="form-control user-email [&_*]:bg-transparent"
                        id="gender"
                        value={value}
                        onChange={(value) => {
                          setValue("gender", value);
                          clearErrors("gender");
                        }}
                        options={[
                          {
                            label: "Male",
                            value: "male",
                          },
                          {
                            label: "Female",
                            value: "female",
                          },
                          {
                            label: "Other",
                            value: "other",
                          },
                        ]}
                      />
                      {errors["gender"] && (
                        <div className="invalid-feedback">
                          Select your gender
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="form-group" id="password">
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    // required: true,
                    validate: (value, formFields) => {
                      const checked = Validator.password(value, {
                        length: "8:",
                        digit: 2,
                        uppercase: 1,
                        symbol: 1,
                      }) as PasswordReturnType;

                      return checked.isValid;
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <Input.Password
                        size="large"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        status={errors.password && "error"}
                        placeholder="Enter your password"
                        className={
                          "user-password form-control p-0 [&_input]:py-[9px] [&_input]:px-[11px]" +
                          (errors["password"] ? " border-red-600" : "")
                        }
                      />
                      {errors["password"] && (
                        <div className="invalid-feedback">
                          Password length must be at least 8, must contains
                          uppercase, lowercase and a Symbol
                        </div>
                      )}
                    </>
                  )}
                />
              </div>
              <Button
                size="large"
                loading={fetching}
                htmlType="submit"
                className="h-auto btn submit_btn auth-sign"
              >
                Sign up
              </Button>
              <p className="register-link">
                <span>Already have an account ?</span>
                <Link href="/sign-in" className="ml-2 hover:text-$text-primary">
                  Sign In
                </Link>
              </p>
            </div>
            <a
              href={"http://localhost:8000/auth/federated/google"}
              id="google"
              className="google"
            >
              <img src="/svgs/google.svg" alt="google" />
              <span>Sign up with Google</span>
            </a>
          </form>
          <div className="svg-container">
            <div className="image-wrap">
              <img src="/images/books.png" alt="" />
            </div>
          </div>
        </div>
      </main>
    </NotAuthenticatedLayout>
  );
}
