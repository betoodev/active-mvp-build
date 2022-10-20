import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { urlPath } = req.body;
  const allowedOrigins = [
    "https://app.betoo.io",
    "http://localhost:3000",
    "http://" + process.env.NEXT_PUBLIC_HTTPS_DOMAIN,
    "https://" + process.env.NEXT_PUBLIC_HTTPS_DOMAIN,
    "http://app." + process.env.NEXT_PUBLIC_HTTPS_DOMAIN,
    "https://app." + process.env.NEXT_PUBLIC_HTTPS_DOMAIN,
  ];

  //res.setHeader("Access-Control-Allow-Origin", "https://app.betoo.io");
  const origin = req.headers.origin || "";
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST");

  try {
    await res.revalidate(urlPath);

    res.status(200).json({
      message: "OK",
    });
  } catch (error) {
    res.status(500).json({
      message: `Failed to revalidate "${urlPath}"`,
    });
  }
}
