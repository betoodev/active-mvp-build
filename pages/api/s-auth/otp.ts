import { NextApiRequest, NextApiResponse } from "next";
import loadStytch from "../../../lib/loadStytch";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const client = loadStytch();
    const data = JSON.parse(req.body);
    try {
      const phoneNumber = data.phoneNumber.replace(/\D/g, "");

      // params are of type stytch.LoginOrCreateUserBySMSRequest
      const params = {
        phone_number: `${data.intlCode}${phoneNumber}`,
      };

      const resp = await client.otps.sms.loginOrCreate(params);
      res.status(200).json({ methodId: resp.phone_id });
    } catch (error) {
      console.log(error);
      res.status(400);
    }
  } else {
    // Handle any other HTTP method
  }
}
