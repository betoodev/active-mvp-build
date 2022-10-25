import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useStytchUser, useStytch, useStytchSession } from "@stytch/nextjs";
import CodeBlock from "../../components/stytch-auth/common/CodeBlock";
import {
  getUsers,
  addUser,
  deleteUserById,
  logout,
} from "../../lib/usersUtils";
import Cookies from "cookies";
import loadStytch from "@/lib/loadStytch";
import { GetServerSideProps } from "next";
type Props = {
  user?: Object;

  session_authenticated?: Object;
  storedSession: any;
  error?: string;
};
const Profile = ({
  error,
  user,
  session_authenticated,
  storedSession,
}: Props) => {
  const stytch = useStytch();
  const router = useRouter();
  const [userList, setUserList] = useState() as any;
  //const token = Cookies.get("token");
  //console.log(Cookies.get(process.env.COOKIE_NAME!), Cookies.get("token"));

  //  console.log("profile session:", { session });
  //console.log("profile session_authenticated:", { session_authenticated });
  useEffect(() => {
    //console.log("profile error", { error });
    if (typeof error !== "undefined") {
      router.replace("/");
      return;
    }
  }, [error, session_authenticated, router]);

  // list users from db and populate userList
  useEffect(() => {
    async function listUsersFromDB() {
      //

      //const addResp = await addUser(user.user_id, fullName, user.emails[0].email);
      console.log("listing users from DB");
      const getUsersResp = await getUsers(storedSession);
      //console.log("listUsersFromDB ", getUsersResp);
      // convert the data to json
      const json = await getUsersResp.json();
      console.log("listUsersFromDB json", json.response[0]);
      setUserList(json);
      //stytch.user.delete;
      json.response.map((user: { email: any }) => console.log(user.email));
      return json;
    }
    listUsersFromDB();
  }, [storedSession]);
  const signOut = async () => {
    await stytch.session.revoke();
  };

  //listUsersFromDB();

  return (
    <div style={styles.container}>
      <div style={styles.details}>
        <h2>Welcome to your profile!</h2>

        <p>usersList: </p>
        {userList && (
          <CodeBlock codeString={JSON.stringify(userList, null, 2)} />
        )}

        <p>users email List: </p>
        {userList && (
          <CodeBlock
            codeString={userList.response.map(
              (user: { email: any }) => user.email + " "
            )}
          />
        )}

        <p>error:</p>
        {error && (
          <CodeBlock
            codeString={JSON.stringify(error, null, 2).replace(" ", "")}
          />
        )}
        <p>Below is your user object that you just created in our API.</p>
        {user && (
          <CodeBlock
            codeString={JSON.stringify(user, null, 2).replace(" ", "")}
          />
        )}

        <button style={styles.button} onClick={signOut}>
          Sign out
        </button>
      </div>
      <div style={styles.details}>
        <h2>Your session detail</h2>
        <p>Below is your session object for this login.</p>

        {session_authenticated && (
          <CodeBlock
            codeString={JSON.stringify(session_authenticated, null, 2).replace(
              " ",
              ""
            )}
          />
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    margin: "48px 24px",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "48px",
  },
  details: {
    backgroundColor: "#FFF",
    padding: "48px",
    flexBasis: "900px",
    flexGrow: 1,
  },
  button: {
    width: "100%",
    height: "45px",
    padding: "0 22px",
    fontSize: "18px",
    whiteSpace: "nowrap",
    borderRadius: "3px",
    position: "relative",
    bottom: "0",
    backgroundColor: "#e5e8eb",
    color: "#19303d",
    margin: "16px 0px",
  },
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get session from cookie
  const cookies = new Cookies(context.req, context.res);
  const storedSession = cookies.get(process.env.COOKIE_NAME!);
  //console.log(process.env.COOKIE_NAME, { storedSession });
  // If session does not exist display an error
  if (!storedSession) {
    //console.log("No user session found.");
    return { props: { error: "No user session found." } };
  }

  try {
    const stytchClient = loadStytch();
    // Validate Stytch session
    const { session } = await stytchClient.sessions.authenticate({
      session_token: storedSession,
    });
    // Get the Stytch user object to display on page
    const user = await stytchClient.users.get(session.user_id);
    //console.log("profile SSP", { user }, { session });
    // Due to Date serialization issues in Next we do some fancy JSON translations
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        //session: JSON.stringify(session),
        session_authenticated: JSON.parse(JSON.stringify(session)),
        storedSession,
      },
    };
  } catch (error) {
    // If session authentication fails display the error.
    return { props: { error: JSON.stringify(error) } };
  }
};

export default Profile;
