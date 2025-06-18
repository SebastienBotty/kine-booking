"use client";
import { usePathname, useRouter } from "next/navigation";
import { LanguageType } from "@/types/type";
import styles from "@/styles/components/LanguageSelector.module.scss";
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";

function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Récupère le chemin sans le préfixe de langue
  const pathWithoutLocale = pathname.replace(/^\/([a-z]{2})(\/|$)/, "/");
  const currentLang = pathname.split("/")[1].toUpperCase() as LanguageType;

  const changeLang = (lang: LanguageType) => {
    router.push(`/${lang.toLowerCase()}${pathWithoutLocale}`);
    setIsOpen(false);
  };

  return (
    <div className={styles.languageSelector}>
      <button className={styles.activeLang} onClick={() => setIsOpen(!isOpen)}>
        {currentLang}{" "}
        <div className={styles.angleDown}>
          <FaAngleDown />
        </div>
      </button>

      <div className={styles.dropdown}>
        {["FR", "NL", "EN"].map(
          (lang) =>
            lang !== currentLang && (
              <button
                key={lang}
                onClick={() => changeLang(lang as LanguageType)}
                className={styles.langButton}
              >
                {lang}
              </button>
            )
        )}
      </div>
    </div>
  );
}

export default LanguageSelector;
