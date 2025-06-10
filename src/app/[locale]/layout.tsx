import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import AuthProvider from "../providers/AuthProvider";
import { SignInButton } from "../components/AuthButtons";
import { getMessages } from "next-intl/server";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;

  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    notFound();
  }
  console.log("AHAHAHAHAHAHAHAHHAHAHAHAHAHAHAHAHAHAHAHAH");
  console.log(locale);
  console.log(messages);
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <AuthProvider>
          <SignInButton />
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
