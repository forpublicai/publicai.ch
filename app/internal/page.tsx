"use client";

export default function InternalPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4">
        <img
          src="/assets/public-ai-logo.png"
          alt="Public AI"
          className="h-8 w-auto"
        />
        <div>
          <h1 className="text-sm font-semibold text-slate-900">
            Internal Project Board
          </h1>
          <span className="inline-block rounded bg-orange-500 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-white">
            Internal
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-baseline gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Launch Tasks
            </h2>
            <span className="text-xs text-slate-500">10 items</span>
          </div>
          <div className="ml-auto">
            <a
              href="/presentations"
              className="inline-flex items-center rounded-lg border border-orange-500 bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-orange-600"
            >
              Open presentations
            </a>
          </div>
        </div>

        <ul className="space-y-2 text-sm">
          {[
            { id: "t1", label: "Narrative package — identify key folks needed", priority: "high" },
            { id: "t2", label: "Kickstarter-like video", priority: "high" },
            { id: "t3", label: "Physical zine", priority: "high" },
            { id: "t4", label: "Docs", priority: "medium" },
            { id: "t5", label: "Forum", priority: "medium" },
            {
              id: "t6",
              label:
                "New site — improved transparency from co-op member discussions",
              priority: "medium",
            },
            { id: "t7", label: "Media campaign", priority: "high" },
            { id: "t8", label: "Partnership kick", priority: "medium" },
            { id: "t9", label: "Finalize startup plan", priority: "high" },
            { id: "t10", label: "Finalize in-person launch date", priority: "high" },
          ].map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm"
            >
              <input
                id={task.id}
                type="checkbox"
                className="h-4 w-4 cursor-pointer accent-orange-500"
              />
              <label
                htmlFor={task.id}
                className="flex-1 cursor-pointer text-slate-900"
              >
                {task.label}
              </label>
              <span
                className={`inline-flex rounded px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${
                  task.priority === "high"
                    ? "bg-rose-50 text-rose-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {task.priority === "high" ? "High" : "Medium"}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-xs text-slate-600">
          This is a temporary internal board. A project management package
          will be imported later. Checkbox state is not persisted — it resets
          on page reload. This page is not indexed by search engines.
        </div>
      </main>

      <footer className="pb-6 pt-4 text-center text-[0.7rem] text-slate-500">
        Public AI Switzerland — Internal Use Only
      </footer>
    </div>
  );
}

