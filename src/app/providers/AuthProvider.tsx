"use client";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
function AuthProvider(props: Props) {
  return <SessionProvider>{props.children}</SessionProvider>;
}

export default AuthProvider;
