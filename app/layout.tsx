import "./globals.css";
import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatWidget from "../components/ChatWidget";

export const metadata = {
  title:
    "Public AI Switzerland — Customer-Owned Cooperative for Affordable AI",
  description:
    "Public AI Switzerland is a customer-owned cooperative that " +
    "distributes Swiss-made AI, especially Apertus, to Swiss residents " +
    "and companies.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <link rel="icon" href="/favicon.ico" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="min-h-screen bg-slate-950 text-gray-900 antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </div>
      </body>
    </html>
  );
}

