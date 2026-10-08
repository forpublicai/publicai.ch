// Application root layout: renders the document shell, config-driven
// header/footer chrome, and the active route. Global CSS is imported as a
// side-effect module (the Framework-mode pattern; see RR styling docs) so it
// works identically in dev (style injection) and in prerendered builds.
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Header } from "~/components/layout/header";
import { Footer } from "~/components/layout/footer";
import type { LinksFunction } from "react-router";
import "~/styles/global.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
];

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}