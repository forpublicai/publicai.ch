"use client";

import Link from "next/link";
import { useState } from "react";

const OPEN_COLLECTIVE_CHECKOUT_URL =
  "https://opencollective.com/datalets/projects/public-ai-switzerland/" +
  "contribute/founding-membership-99202/checkout" +
  "?interval=year&amount=100&contributeAs=me";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((prev) => !prev);
  };

  const close = () => {
    setOpen(false);
  };

  return (
    <>
      <nav className="absolute inset-x-0 top-0 z-40 bg-transparent backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold
                       text-white drop-shadow-sm"
          >
            <img
              src="/assets/public-ai-logo.png"
              alt="Public AI Switzerland"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <div className="hidden items-center gap-2 text-sm sm:flex">
          <span
            className="cursor-not-allowed rounded-full px-3 py-1 text-xs
                       font-medium text-white/60"
          >
            About
          </span>
          <a
            href={OPEN_COLLECTIVE_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-3.5 py-1.5 text-xs
                       font-semibold text-slate-900 shadow-sm
                       hover:bg-slate-100"
          >
            Join
          </a>
          <span
            className="cursor-not-allowed rounded-full px-3 py-1 text-xs
                       font-medium text-white/60"
          >
            Login
          </span>
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle navigation menu"
          aria-expanded={open ? "true" : "false"}
          className="relative flex h-9 w-9 items-center justify-center
                     rounded-md text-white sm:hidden"
        >
          <span className="sr-only">Open main menu</span>
          <div className="flex h-4 w-5 flex-col justify-between">
            <span className="block h-0.5 w-full rounded-full bg-white" />
            <span className="block h-0.5 w-full rounded-full bg-white" />
            <span className="block h-0.5 w-full rounded-full bg-white" />
          </div>
        </button>
        </div>
      </nav>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30 bg-slate-950/80 sm:hidden"
            onClick={close}
          />
          <aside
            className="fixed inset-y-0 right-0 z-40 w-4/5 max-w-xs bg-slate-950
                       px-5 py-5 text-sm text-white shadow-xl sm:hidden
                       flex flex-col overflow-y-auto"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Menu
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close navigation menu"
                className="text-xs font-medium text-white/70"
              >
                Close
              </button>
            </div>

            <nav className="flex flex-col gap-3">
              <span className="cursor-not-allowed text-sm text-white/60">
                About
              </span>
              <a
                href={OPEN_COLLECTIVE_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-white underline
                           underline-offset-4"
                onClick={close}
              >
                Join
              </a>
              <span className="cursor-not-allowed text-sm text-white/60">
                Login
              </span>
            </nav>

            <p className="mt-8 text-xs leading-relaxed text-white/70">
              Public AI Switzerland is a customer-owned cooperative for AI
              infrastructure.
            </p>
          </aside>
        </>
      )}
    </>
  );
}

