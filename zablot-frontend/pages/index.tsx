import HomePage from "@comp/HomePage";
import NotAuthenticatedLayout from "@comp/NotAuthenticatedLayout";
import Dashboard from "@comp/dashboard";
import { useAppSelector } from "@lib/redux/store";
import { USER } from "@lib/redux/userSlice";
import { verify } from "@lib/token";
import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { useStore } from "react-redux";

export default function RootPage(props: {
  children?: React.ReactNode;
  user: Zablot.User;
  loggedIn: boolean;
}) {
  const isLoggedIn = useAppSelector((state) => state.sessionStore.loggedIn);

  return isLoggedIn || props.loggedIn ? (
    <Dashboard {...props} />
  ) : (
    <NotAuthenticatedLayout>
      <HomePage />
    </NotAuthenticatedLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const sid = req.cookies.sid as string;

    let emptyUser = {
      props: {
        user: null,
      },
    };
    if (!sid || verify(sid).error) return emptyUser;

    let path = (process.env.SERVER_URL as string) + "/user";
    const response = await axios.get(path, {
      headers: { Authorization: sid },
      validateStatus: (status) => status < 500,
    });
    const { user, success } = await response.data;

    if (!success || !user) return emptyUser;
    return {
      props: { user, loggedIn: true },
    };
  } catch (error) {
    console.log({ error });
    return {
      props: {
        user: null,
      },
    };
  }
};
