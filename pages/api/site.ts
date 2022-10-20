import { createSite, deleteSite, getSite, updateSite } from "@/lib/api";
//import { unstable_getServerSession } from "next-auth/next";

//import { authOptions } from "./auth/[...nextauth]";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";
import { validSessionToken } from "../../lib/StytchSession";
import withSession from "../../lib/withSession";
import loadStytch from "../../lib/loadStytch";

async function site(req: NextApiRequest, res: NextApiResponse) {
  //const session = await unstable_getServerSession(req, res, authOptions);
  const stytchClient = loadStytch();
  var token = (req.query["token"] ||
    req.cookies[process.env.COOKIE_NAME as string]) as string;

  //validate session
  var isValidSession = await validSessionToken(token);
  if (!isValidSession) {
    res.status(401).json({ error: "user unauthenticated" });
    return;
  }

  // Validate Stytch session
  const { session } = await stytchClient.sessions.authenticate({
    session_token: token,
  });
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      return getSite(req, res);
    case HttpMethod.POST:
      return createSite(req, res);
    case HttpMethod.DELETE:
      return deleteSite(req, res);
    case HttpMethod.PUT:
      return updateSite(req, res);
    default:
      res.setHeader("Allow", [
        HttpMethod.GET,
        HttpMethod.POST,
        HttpMethod.DELETE,
        HttpMethod.PUT,
      ]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
export default withSession(site);
