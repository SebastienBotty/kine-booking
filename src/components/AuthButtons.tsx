"use client";

import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "./Button";
import { useTranslations } from "next-intl";

export const AuthButtons = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const t = useTranslations();

  const SignOutButton = () => {
    return (
      <Button size="md" variant="secondary" onClick={() => signOut()}>
        {t("Navbar.disconnect")}
      </Button>
    );
  };

  if (session?.user) {
    return (
      <>
        <div onClick={() => console.log(session.user)}>{session.user.name}</div> -----{" "}
        <SignOutButton />
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

    return (
      <Button onClick={handleSignIn} size="md" variant="secondary">
        {t("Navbar.signin")}
      </Button>
    );
  }
};
