import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <main className="home">
      <Image
        className="home-logo"
        src="/next.svg"
        alt={t("nextLogoAlt")}
        width={100}
        height={20}
        priority
      />
      <div className="home-intro">
        <h1>{t("title")}</h1>
        <p>
          {t.rich("description", {
            templates: (chunks) => (
              <a
                href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                {chunks}
              </a>
            ),
            learning: (chunks) => (
              <a
                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
      <div className="home-ctas">
        <a
          className="home-cta home-cta--primary"
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="home-logo"
            src="/vercel.svg"
            alt={t("vercelLogoAlt")}
            width={16}
            height={16}
          />
          {t("deployNow")}
        </a>
        <a
          className="home-cta home-cta--secondary"
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("documentation")}
        </a>
      </div>
    </main>
  );
}
