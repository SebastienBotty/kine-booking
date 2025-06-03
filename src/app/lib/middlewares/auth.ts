// lib/middleware/auth.ts

import type { NextApiRequest, NextApiResponse } from "next";
import admin from "../firebase/firebaseAdmin"; // ton init firebase-admin

export default async function authFirebase(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing token" });
    return null;
  }
  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    (req as any).user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || "user", // si tu as ajouté un custom claim role
    };
    return decodedToken;
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
    return null;
  }
}
