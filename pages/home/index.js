import Head from "next/head";

import { useEffect, useState } from "react";
import SLogin from "../../components/stytch-auth/SLogin";
import withSession from "../../lib/withSession";

/*import dynamic from "next/dynamic";

const LoginWithMagicLinks = dynamic(
  () => {
    return import("../../components/stytch-auth/LoginWithMagicLinks");
  },
  { ssr: false }
);
*/
export default function Home(props) {
  //This state holds the projects associated with the user
  const [clientProjects, setClientProjects] = useState(null);

  //This state contains the logged in status of the user
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //User's session details
  const { user } = props;
  console.log({ user });

  // Sets local isLoggedIn variable
  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Logs a user out
  const logOut = async () => {
    setIsLoggedIn(false);

    const resp = await fetch("/api/s-auth/logout", { method: "POST" });
  };

  // Display the client portal page
  return (
    <div>
      <Head>
        <title>Client Portal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="mt-10 m-auto text-center justify-center items-center bg-blue-100 p-8 rounded w-96 ">
          <h1>Welcome to betoo</h1>
          <div className="m-6">
            <SLogin></SLogin>
          </div>
          <div className="bg-red-200 p-6 mt-9">
            {isLoggedIn ? (
              <div>
                <p>You are now logged in.</p>
                <p>{user.email}</p>
                <p className="m-2 text-xs text-left">{user.session_token}</p>
                <p
                  style={{ textAlign: "center", cursor: "pointer" }}
                  onClick={logOut}
                >
                  Log Out
                </p>
              </div>
            ) : (
              <div>You are logged out.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const getServerSidePropsHandler = async ({ req }) => {
  // Get the user's session based on the request
  const user = req.session.get("user") ?? null;
  const props = { user };
  console.log({ user });
  return { props };
};

export const getServerSideProps = withSession(getServerSidePropsHandler);