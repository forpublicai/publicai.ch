export default function PrivacyPage() {
  return (
    <main className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-4 text-3xl font-extrabold text-slate-900">
          Privacy Notice
        </h1>
        <p className="mb-4 text-sm text-slate-700">
          This Privacy Notice explains how Public AI Switzerland handles
          personal data across our website and related services.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-slate-900">
          Data we may process
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          We may process contact details, usage information, and technical
          diagnostics needed to operate and improve services.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-slate-900">
          Why we process data
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          We process data to provide services, maintain security, and respond
          to support or partnership requests.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-slate-900">
          Data sharing
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          We do not sell personal data. We may share limited data with
          trusted service providers as required for service delivery.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-slate-900">
          Your rights
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          You may request access, correction, or deletion of your data by
          contacting us.
        </p>

        <h2 className="mt-6 text-lg font-semibold text-slate-900">
          Contact
        </h2>
        <p className="mt-1 text-sm text-slate-700">
          Privacy questions:{" "}
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

