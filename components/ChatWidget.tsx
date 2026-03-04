"use client";

import { useState } from "react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open chat"
        aria-expanded={open ? "true" : "false"}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-4 z-40 inline-flex h-11 items-center
                   justify-center rounded-full bg-orange-500 px-4 text-xs
                   font-semibold text-white shadow-lg shadow-orange-500/40
                   hover:bg-orange-600"
      >
        Chat with Apertus
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-slate-900/60"
            onClick={() => setOpen(false)}
          />
          <div
            className="relative z-10 flex h-[70vh] w-full max-w-md flex-col
                       overflow-hidden rounded-t-2xl bg-white shadow-2xl
                       sm:h-[80vh] sm:rounded-2xl"
          >
            <header className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-900">
                  Apertus chat (coming soon)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </header>
            <div className="flex flex-1 flex-col justify-between bg-slate-50">
              <div className="flex-1 overflow-auto px-4 py-3 text-xs text-slate-700">
                <p className="mb-2">
                  This is a placeholder for an embedded chat experience,
                  similar to the one on publicai.co.
                </p>
                <p>
                  In the next phase, this panel can host an embedded iframe or
                  a native chat UI wired to your production backend.
                </p>
              </div>
              <div className="border-t border-slate-200 bg-white px-3 py-2">
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-[0.7rem] text-slate-500">
                  Chat input and send controls will appear here once wired to
                  the live chat service.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

