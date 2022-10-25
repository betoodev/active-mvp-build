import * as stytch from "stytch";

let client: stytch.Client;
const loadStytch = () => {
  if (!client) {
    console.log("creating stytch client", process.env.STYTCH_PROJECT_ID);
    client = new stytch.Client({
      project_id: process.env.STYTCH_PROJECT_ID || "",
      secret: process.env.STYTCH_SECRET || "",
      env:
        process.env.STYTCH_PROJECT_ENV === "live"
          ? stytch.envs.live
          : stytch.envs.test,
    });
  }

  return client;
};
export default loadStytch;
