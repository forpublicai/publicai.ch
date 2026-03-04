export default function AboutPage() {
  return (
    <main className="bg-white">
      <header
        className="relative flex min-h-[55vh] items-center justify-center
                   overflow-hidden bg-slate-900 text-white"
      >
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://upload.wikimedia.org/wikipedia/commons/" +
              "thumb/2/22/View_of_Lake_Lugano_01.jpg/1280px-View_of_Lake_Lugano_01.jpg')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-slate-950/60" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-white">
            About Public AI Switzerland
          </h1>
          <p className="text-sm font-medium text-slate-100">
            A customer-owned cooperative building AI infrastructure for public
            benefit.
          </p>
        </div>
      </header>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-4 text-2xl font-extrabold text-slate-900">
            AI infrastructure that serves people
          </h2>
          <p className="mb-3 text-lg font-medium text-slate-800">
            Public AI Switzerland is a customer-owned cooperative that
            distributes Swiss-made AI, especially Apertus, to Swiss residents
            and companies. We use cooperative ownership to keep AI affordable,
            transparent, and accountable to the people who use it.
          </p>
          <p className="mb-4 text-sm text-slate-700">
            Instead of extracting value for outside shareholders, we reinvest
            in shared infrastructure, community capacity, and long-term public
            benefit.
          </p>
          <p className="mt-4">
            <a
              href="/#join"
              className="inline-flex items-center rounded-full bg-orange-500
                         px-5 py-2 text-xs font-semibold text-white shadow-sm
                         hover:bg-orange-600"
            >
              Become a Founding Member
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

