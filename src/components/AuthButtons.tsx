"use client";

import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "./Button";
import { useTranslations } from "next-intl";

import { FaArrowRightToBracket } from "react-icons/fa6";

export const AuthButtons = () => {
  const { data: session } = useSession();
  return session?.user ? <SignOutButton /> : <SignInButton />;
};

export const SignInButton = () => {
  const pathname = usePathname();
  const t = useTranslations();

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
};

export const SignOutButton = () => {
  const t = useTranslations();
  return (
    <Button
      size="md"
      variant="secondary"
      iconRight={<FaArrowRightToBracket />}
      onClick={() => signOut()}
    >
      {t("Navbar.disconnect")}
    </Button>
  );
};
