"use client";

import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export const SignInButton = () => {
  const { data: session } = useSession();
  if (session && session.user) {
    return (
      <>
        {session.user.name} ----- <SignOutButton />
      </>
    );
  } else {
    return <button onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}>Login</button>;
  }
};

export const SignOutButton = () => {
  return <button onClick={() => signOut({ callbackUrl: "/" })}>Logout</button>;
};
