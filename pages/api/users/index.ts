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
    getUsers(req, res);
  } else if (req.method === "POST") {
    addUser(req, res);
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
    const response = await prisma.user.findMany({});

    res.status(200).json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "an error occurred" });
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
    // var query = "INSERT INTO User (name, email) VALUES (?,?)";
    // var params = [name, email];

    // var insertID;
    // const result = sqlConn.query(query, params, (err, result) => {
    //   console.log("Inserting user to db...");
    //   if (err) {
    //     console.log("Error insert:", err);
    //     throw err;
    //   }

    //   insertID = (<OkPacket>result).insertId;
    //   console.log("insertID", insertID);
    //   res.status(201).json({ id: insertID });
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
