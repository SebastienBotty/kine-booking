// lib/middleware/authAdmin.ts
import type { NextApiRequest, NextApiResponse } from "next";
import auth from "./auth";

export default function authAdmin(req: NextApiRequest, res: NextApiResponse) {
  const payload = auth(req, res);
  if (!payload) return null;

  if ((payload as any).role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return null;
  }

  return payload;
}
