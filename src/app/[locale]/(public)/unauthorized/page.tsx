"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

function Page() {
  const router = useRouter();
  const [clock, setClock] = useState<number>(5);
  const t = useTranslations();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.back();
    }, 5000);

    const interval = setInterval(() => {
      setClock((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div>
      {t("unauthorized.message")}
      <br />
      <small>
        {" "}
        {t("unauthorized.redirection")} {clock}
      </small>
    </div>
  );
}

export default Page;
