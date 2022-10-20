import { createPost, deletePost, getPost, updatePost } from "@/lib/api";
import loadStytch from "@/lib/loadStytch";
import { validSessionToken } from "@/lib/StytchSession";
//import { unstable_getServerSession } from "next-auth/next";

//import { authOptions } from "./auth/[...nextauth]";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  //const session = await unstable_getServerSession(req, res, authOptions);
  //if (!session) return res.status(401).end();

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
      return getPost(req, res, session);
    case HttpMethod.POST:
      return createPost(req, res);
    case HttpMethod.DELETE:
      return deletePost(req, res);
    case HttpMethod.PUT:
      return updatePost(req, res);
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
