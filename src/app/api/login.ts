// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  if (!token) return res.status(400).json({ error: "No token" });

  // Ajoute cookie HTTP-only
  setCookie("session", token, {
    req,
    res,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: "/",
  });

  res.status(200).json({ message: "Logged in" });
}
