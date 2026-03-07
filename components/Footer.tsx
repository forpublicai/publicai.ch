import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-200 bg-slate-950">
      <div
        className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4
                   text-xs text-slate-200 sm:flex-row sm:items-center
                   sm:justify-between"
      >
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a
            href="https://www.swiss-ai.org/apertus"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Apertus Docs
          </a>
          <a
            href="https://publicai.co"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Public AI Homepage
          </a>
          <a
            href="https://huggingface.co/blog/inference-providers-publicai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Hugging Face: Public AI
          </a>
          <a
            href="https://github.com/forpublicai/platform.publicai.co"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Platform Source
          </a>
          <a
            href="https://github.com/forpublicai/chat.publicai.co"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Chat UI Source
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <div className="flex gap-2">
            <Link
              href="/terms"
              className="underline underline-offset-2"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              href="/privacy"
              className="underline underline-offset-2"
            >
              Privacy Notice
            </Link>
            <Link
              href="/about"
              className="underline underline-offset-2"
            >
              About
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-slate-950">
        <div className="mx-auto max-w-5xl px-4 pb-4 text-[0.65rem] text-slate-400">
          <p>
            Photo: Joshua Tan (CC BY 4.0) ·{" "}
            <br />
            Icons:{" "}
            <a
              href="https://thenounproject.com/browse/collection-icon/ai-197389/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Noun Project
            </a>{" "}
            (CC BY 3.0)
          </p>
          <p className="mt-1">
            Copyright &copy; Public AI Switzerland 2026. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

