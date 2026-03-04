export default function TermsPage() {
  return (
    <main className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-4 text-3xl font-extrabold text-slate-900">
          Terms &amp; Conditions
        </h1>
        <p className="mb-4 text-sm text-slate-700">
          These Terms &amp; Conditions govern use of Public AI Switzerland
          websites and related services.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-slate-900">
          Service scope
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          Public AI Switzerland provides cooperative AI access, platform
          services, and related communications.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-slate-900">
          Acceptable use
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          You agree not to misuse the service, violate laws, or infringe on
          rights of others.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-slate-900">
          Changes
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          We may update these terms from time to time. Continued use after
          updates means acceptance of revised terms.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-slate-900">
          Contact
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          For questions, contact{" "}
          <a
            href="mailto:hello@publicai.co"
            className="underline underline-offset-4"
          >
            hello@publicai.co
          </a>
          .
        </p>
      </div>
    </main>
  );
}

