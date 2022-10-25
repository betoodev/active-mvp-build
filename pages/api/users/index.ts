import type { NextApiRequest, NextApiResponse } from "next";
import { validSessionToken } from "../../../lib/StytchSession";
import cuid from "cuid";
import prisma from "@/lib/prisma";

export interface User {
  id: number;
  email: string;
  name: string;
}

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  var token = (req.query["token"] ||
    req.cookies[process.env.COOKIE_NAME as string]) as string;

  console.log("TOKEN: ", token);

  //validate session
  var isValidSession = await validSessionToken(token);
  console.log("isValidSession: ", isValidSession);
  if (!isValidSession) {
    res.status(401).json({ error: "user unauthenticated" });
    return;
  }

  if (req.method === "GET") {
    console.log("GET getUsers");
    return getUsers(req, res);
  } else if (req.method === "POST") {
    return addUser(req, res);
  }
  return;
}

//getUsers retrieve all users
async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    // var query = "select * from User";

    // var users;
    // const result = await sqlConn
    //   .promise()
    //   .query(query)
    //   .then(([rows]) => {
    //     users = rows;
    //   });
    var response = null;
    // var user = JSON.parse(req.body);
    // console.log({ user });
    // if (user) {
    //   response = await prisma.user.findUnique({
    //     where: {
    //       stytch_id: user.stytch_id,
    //     },
    //   });
    // } else {
    console.log("getting prisma.user.findMany");
    response = await prisma.user.findMany({});
    // }
    console.log({ response });

    return res.status(200).json({ response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "an error occurred" });
  }
  return;
}

//addUser create a new user
async function addUser(req: NextApiRequest, res: NextApiResponse) {
  var user = JSON.parse(req.body);
  console.log("addUser user:", { user });
  var stytch_id = user.stytch_id;
  var email = user.email;
  var name = user.fullName;

  try {
    const response = await prisma.user.create({
      data: {
        stytch_id,
        name,
        email,
      },
    });
    console.log("response added user:", { response });
    res.status(201).json({ response });
  } catch (error) {
    console.error("error insert2: ", error);
    res.status(500).json({ error: "an error occurred" });
  }
  return;
}

export default handler;
