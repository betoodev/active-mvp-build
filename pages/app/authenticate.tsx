import { useEffect } from "react";
import { useRouter } from "next/router";
import { useStytchUser, useStytch } from "@stytch/nextjs";
import {
  getUsers,
  addUser,
  deleteUserById,
  logout,
} from "../../lib/usersUtils";

const OAUTH_TOKEN = "oauth";
const MAGIC_LINKS_TOKEN = "magic_links";
const RESET_LOGIN = "login";

const Authenticate = () => {
  const { user, isInitialized } = useStytchUser();
  const stytch = useStytch();
  const router = useRouter();

  useEffect(() => {
    const stytch_token_type = router?.query?.stytch_token_type?.toString();
    const token = router?.query?.token?.toString();
    if (token && stytch_token_type === OAUTH_TOKEN) {
      stytch.oauth.authenticate(token, {
        session_duration_minutes: 30,
      });
    } else if (
      token &&
      stytch_token_type &&
      [MAGIC_LINKS_TOKEN, RESET_LOGIN].includes(stytch_token_type)
    ) {
      stytch.magicLinks.authenticate(token, {
        session_duration_minutes: 30,
      });
    }
  }, [router, stytch]);

  useEffect(() => {
    async function addUserToDB(user: any) {
      //
      var fullName =
        user.name.first_name +
        " " +
        user.name.middle_name +
        " " +
        user.name.last_name;
      const addResp = await addUser(
        user.user_id,
        fullName,
        user.emails[0].email
      );
      console.log("addResp.status: ", { addResp });
    }

    if (!isInitialized) {
      return;
    }
    if (user) {
      {
        /* sync user to db */
        //add user to DB
        console.log("app addUserToDB...");
        addUserToDB(user);

        console.log({ user });
        router.replace("/");
      }
      console.log({ user });
      //router.replace("/profile");
    }
  }, [router, user, isInitialized]);

  return null;
};

export default Authenticate;