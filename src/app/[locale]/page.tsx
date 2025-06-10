import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

import AuthProvider from "../providers/AuthProvider";
import { getTranslations } from "next-intl/server";
import LanguageSelector from "../components/LanguageSelector";
import styles from "@/styles/layout/landing.module.scss";

export default async function HomePage() {
  const t = await getTranslations();

  // Récupération des tableaux via t.raw
  const services: string[] = t.raw("home.services");
  const team: { name: string; role: string }[] = t.raw("home.team");

  return (
    <div className={styles.page}>
      <LanguageSelector />
      {/* Header */}
      <header className={styles.header}>
        <h1>{t("home.title")}</h1>
        <p>{t("home.subtitle")}</p>
        <Link href="#rdv" className={styles.ctaButton}>
          {t("home.cta")}
        </Link>
      </header>

      {/* Présentation */}
      <section className={styles.section}>
        <h2>{t("home.aboutTitle")}</h2>
        <p>{t("home.aboutText")}</p>
      </section>

      {/* Services */}
      <section className={styles.section}>
        <h2>{t("home.servicesTitle")}</h2>
        <ul className={styles.servicesList}>
          {services.map((service, i) => (
            <li key={i}>{service}</li>
          ))}
        </ul>
      </section>

      {/* Équipe */}
      <section className={styles.section}>
        <h2>{t("home.teamTitle")}</h2>
        <div className={styles.team}>
          {team.map((member, i) => (
            <div className={styles.teamMember} key={i}>
              <Image
                src={`/kine${i + 1}.jpg`}
                alt={`Photo ${member.name}`}
                width={100}
                height={100}
              />
              <p>
                {member.name}
                <br />
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Prise de rendez-vous */}
      <section className={styles.section} id="rdv">
        <h2>{t("home.bookingTitle")}</h2>
        <Link href="/booking" className={styles.ctaButton}>
          {t("home.bookingCta")}
        </Link>
      </section>

      {/* Contact */}
      <section className={styles.section}>
        <h2>{t("home.contactTitle")}</h2>
        <p>{t("home.address")}</p>
        <p>{t("home.phone")}</p>
        <p>{t("home.email")}</p>
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=2.3488%2C48.8534%2C2.3588%2C48.8634&layer=mapnik"
          width="100%"
          height="200"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>{t("home.copyright")}</p>
        <div>
          <a href="#">{t("home.legal")}</a> | <a href="#">{t("home.privacy")}</a>
        </div>
      </footer>
    </div>
  );
}
