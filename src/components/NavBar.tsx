"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "@/styles/components/NavBar.module.scss";
import { FaAlignJustify, FaXmark } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import LanguageSelector from "./LanguageSelector";
import { useSession } from "next-auth/react";
import { AuthButtons, SignInButton, SignOutButton } from "./AuthButtons";
import { FaAngleDown } from "react-icons/fa6";

interface LinkType {
  href: string;
  label: string;
}

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  const { data: session } = useSession();

  const userLinks = [
    { href: "/myAccount", label: t("Navbar.myAccount") },
    { href: "/myAppointments", label: t("Navbar.myAppointments") },
  ];
  const practitionerLinks = [{ href: "/mySchedule", label: t("Navbar.mySchedule") }];
  const adminLinks = [
    { href: "/management", label: t("Navbar.management") },
    { href: "/allAppointments", label: t("Navbar.allAppointments") },
    { href: "/settings", label: t("Navbar.settings") },
  ];

  const displayLinks = (linksArr: LinkType[]) => {
    return linksArr.map((link) => (
      <li key={link.href} className={`${styles.navItem} ${styles.accountLinks}`}>
        <Link href={link.href} className={styles.navLink}>
          {link.label}
        </Link>
      </li>
    ));
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLogo}>
          <Link href="/">KineBoxel</Link>
        </div>

        <div className={styles.menuIcon}>
          {session?.user ? session.user.name : <SignInButton />}

          <LanguageSelector />
          {isOpen ? (
            <FaXmark onClick={() => setIsOpen(!isOpen)} />
          ) : (
            <FaAlignJustify onClick={() => setIsOpen(!isOpen)} />
          )}
        </div>

        <ul className={`${styles.navMenu} ${isOpen ? styles.active : ""}`}>
          <li className={styles.navItem}>
            <Link href="/" className={styles.navLink}>
              {t("Navbar.home")}
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/equipe" className={styles.navLink}>
              {t("Navbar.team")}
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/soins" className={styles.navLink}>
              {t("Navbar.care")}
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/contact" className={styles.navLink}>
              {t("Navbar.contact")}
            </Link>
          </li>
          {isOpen && session?.user && displayLinks(userLinks)}
          {(isOpen && session?.user.role === "practitioner") ||
            (isOpen && session?.user.role === "admin" && displayLinks(practitionerLinks))}
          {isOpen && session?.user.role === "admin" && displayLinks(adminLinks)}
          <li className={styles.navItem}>
            {session?.user && !isOpen ? (
              <div className={styles.userDropdown}>
                <span className={styles.navLink}>
                  {session.user.name}
                  <FaAngleDown className={styles.angleDown} />
                </span>
                <ul className={styles.dropdownMenu}>
                  {displayLinks(userLinks)}
                  {session?.user.role === "practitioner" ||
                    (session?.user.role === "admin" && displayLinks(practitionerLinks))}
                  {session?.user.role === "admin" && displayLinks(adminLinks)}
                  <li className={styles.navItem}>
                    <SignOutButton />
                  </li>
                </ul>
              </div>
            ) : (
              <div className={` ${styles.navLink} ${styles.accountLinks} `}>
                <AuthButtons />
              </div>
            )}
          </li>
          {!isOpen && (
            <li className={styles.navItem}>
              <div className={styles.navlink}>
                {" "}
                <LanguageSelector />
              </div>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
