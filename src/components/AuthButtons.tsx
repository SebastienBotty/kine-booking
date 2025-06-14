"use client";

import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export const SignInButton = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (session?.user) {
    return (
      <>
        {session.user.name} ----- <SignOutButton />
      </>
    );
  } else {
    const handleSignIn = () => {
      const isHome = pathname === "/";
      if (isHome) {
        signIn(undefined, { callbackUrl: "/dashboard" });
      } else {
        signIn();
      }
    };

    return <button onClick={handleSignIn}>Login</button>;
  }
};

export const SignOutButton = () => {
  return <button onClick={() => signOut({ callbackUrl: "/" })}>Logout</button>;
};
