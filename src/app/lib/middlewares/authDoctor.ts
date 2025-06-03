// lib/middleware/authKine.ts
import type { NextApiRequest, NextApiResponse } from "next";
import auth from "./auth";

export default function authKine(req: NextApiRequest, res: NextApiResponse) {
  const payload = auth(req, res);
  if (!payload) return null;

  if ((payload as any).role !== "doctor") {
    res.status(403).json({ error: "Kiné access required" });
    return null;
  }

  return payload;
}
