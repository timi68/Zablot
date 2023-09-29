import HomePage from "@comp/HomePage";
import NotAuthenticatedLayout from "@comp/NotAuthenticatedLayout";
import WithUser from "@comp/WithUser";
import Dashboard from "@comp/dashboard";
import getUser from "@lib/getUser";
import { useAppSelector } from "@lib/redux/store";
import { GetServerSideProps } from "next";
import React from "react";

export default function RootPage(props: {
  children?: React.ReactNode;
  user: Zablot.User;
  loggedIn: boolean;
}) {
  const isLoggedIn = useAppSelector((state) => state.sessionStore.loggedIn);

  return isLoggedIn || props.loggedIn ? (
    <WithUser user={props.user}>
      <Dashboard {...props} />
    </WithUser>
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

    // if (!sid || verify(sid).error) return emptyUser;
    const { user, success } = await getUser(sid);

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
