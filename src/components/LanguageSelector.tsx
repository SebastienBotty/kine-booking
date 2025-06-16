"use client";
import { usePathname, useRouter } from "next/navigation";
import { LanguageType } from "@/types/type";

function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();

  // Récupère le chemin sans le préfixe de langue
  const pathWithoutLocale = pathname.replace(/^\/([a-z]{2})(\/|$)/, "/");

  const changeLang = (lang: LanguageType) => {
    router.push(`/${lang.toLowerCase()}${pathWithoutLocale}`);
  };

  return (
    <div style={{ position: "absolute", top: 24, right: 32, zIndex: 10 }}>
      <button onClick={() => changeLang("FR")}>FR</button>
      <button onClick={() => changeLang("NL")}>NL</button>
      <button onClick={() => changeLang("EN")}>EN</button>
    </div>
  );
}

export default LanguageSelector;
