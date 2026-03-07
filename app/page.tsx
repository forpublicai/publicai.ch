import Link from "next/link";

function Hero() {
  return (
    <header
      className="relative flex min-h-screen items-center justify-center
                 overflow-hidden text-white"
      id="top"
    >
      <img
        src="/assets/IMG_2517.jpg"
        alt="View of Lake Lugano"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-slate-950/40" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center
                      px-6 text-center">
        <h1
          className="mb-3 text-3xl font-semibold tracking-tight
                     sm:text-4xl"
        >
          AI made to Swiss standards
        </h1>
        <p
          className="max-w-xl text-sm font-medium text-slate-100
                     sm:text-base"
        >
          Join{" "}
          <strong className="font-semibold text-orange-200">
            35,132 citizens
          </strong>{" "}
          and{" "}
          <strong className="font-semibold text-orange-200">
            1,439 developers
          </strong>{" "}
          using{" "}
          <a
            href="https://www.swiss-ai.org/apertus"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Apertus
          </a>
          .
        </p>
      </div>

      <a
        href="#intro"
        aria-label="Scroll down"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-3xl
                   text-white drop-shadow-sm"
        style={{ animation: "heroChevronBob 2.8s ease-in-out infinite" }}
      >
        &#8964;
      </a>
    </header>
  );
}

function IntroSection() {
  return (
    <section
      id="intro"
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight">
          The world&apos;s first cooperative for AI
        </h2>
        <p className="mx-auto max-w-2xl text-lg font-medium text-slate-700">
          Public AI Switzerland is a customer-owned cooperative that
          distributes Swiss-made AI, especially Apertus, to Swiss residents
          and companies. Think Migros for AI.
        </p>
      </div>
    </section>
  );
}

function FoundingMemberCta() {
  return (
    <section
      id="join"
      className="relative overflow-hidden bg-gradient-to-r
                 from-orange-500 to-rose-600 py-20 text-white"
    >
      <div className="absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-4xl px-6">
        <h2 className="mb-3 text-center text-3xl font-extrabold">
          Our plan: AI owned by the people
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm
                      sm:text-base">
          Big Tech&apos;s control over AI threatens our jobs and our
          society. It&apos;s time for a new model — one we collectively own
          and control.{" "}
          <strong>
            We have a plan for organizing AI around local control, democratic
            governance, and shared benefit. Join us today as a Founding Member
            to get involved.
          </strong>
        </p>

        <div className="mt-8 border-t border-white/30 pt-8">
          <h3
            className="mb-3 text-center text-[0.7rem] font-semibold
                       tracking-[0.2em]"
          >
            BECOME A FOUNDING MEMBER
          </h3>
          <div className="mx-auto flex max-w-md justify-center">
            <div
              className="flex flex-1 flex-col items-center rounded-2xl
                         border-2 border-white/40 bg-white/10 p-5
                         text-center shadow-md backdrop-blur"
            >
              <div className="mb-1 text-2xl font-extrabold">CHF 100</div>
              <p className="mb-4 text-xs text-orange-50">
                Founding Membership in Public AI Switzerland
              </p>
              <a
                href="https://opencollective.com/datalets/projects/public-ai-switzerland/contribute/founding-membership-99202/checkout?interval=year&amount=100&contributeAs=me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full
                           bg-white px-5 py-2 text-xs font-semibold
                           text-orange-600 shadow-sm hover:bg-orange-50"
              >
                Join and claim membership
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/30 pt-8">
          <h3
            className="mb-4 text-center text-xs font-semibold
                       tracking-[0.2em]"
          >
            FOUNDING MEMBER BENEFITS
          </h3>
          <div className="grid gap-5 md:grid-cols-3">
            <div
              className="rounded-xl border border-white/30 bg-white/10
                         p-4 text-left shadow-sm backdrop-blur"
            >
              <div className="mb-1 text-sm font-semibold">
                Upgraded Chat Experience
              </div>
              <p className="text-xs text-orange-50">
                Access larger context windows, file and image uploads, and
                group chats in an enhanced Apertus experience built for
                serious day-to-day use.
              </p>
            </div>
            <div
              className="rounded-xl border border-white/30 bg-white/10
                         p-4 text-left shadow-sm backdrop-blur"
            >
              <div className="mb-1 text-sm font-semibold">
                Stay on the Cutting Edge
              </div>
              <p className="text-xs text-orange-50">
                Access a set of new AI tools every month, curated and
                sourced from our community and technology partners.
              </p>
            </div>
            <div
              className="rounded-xl border border-white/30 bg-white/10
                         p-4 text-left shadow-sm backdrop-blur"
            >
              <div className="mb-1 text-sm font-semibold">
                Limited Edition Physical Zine
              </div>
              <p className="text-xs text-orange-50">
                Receive a limited physical copy of the Own Our Own (O3)
                Plan, plus a membership certificate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  const items = [
    {
      year: "1899",
      logo: "/assets/logo-raiffeisen.png",
      alt: "Raiffeisen",
      era: "Banking for the people",
      detail:
        "When banks served cities but not farmers, Swiss communities " +
        "pooled their savings and governed their own credit.",
    },
    {
      year: "1925",
      logo: "/assets/logo-migros.png",
      alt: "Migros",
      era: "Fair access to essentials",
      detail:
        "When middlemen inflated food prices, Gottlieb Duttweiler " +
        "drove a truck to the people. Today Migros is Switzerland's " +
        "largest retailer — still a cooperative.",
    },
    {
      year: "1941",
      logo: "/assets/logo-coop.png",
      alt: "Coop",
      era: "Consumer solidarity",
      detail:
        "When wartime scarcity threatened households, consumer " +
        "cooperatives merged into a national force, putting purchasing " +
        "power back in members' hands.",
    },
    {
      year: "1997",
      logo: "/assets/logo-mobility.png",
      alt: "Mobility",
      era: "Shared infrastructure",
      detail:
        "When private car ownership proved wasteful, Switzerland " +
        "pioneered cooperative car-sharing — now 230,000 members strong.",
    },
    {
      year: "2025",
      logo: "/assets/public-ai-logo.png",
      alt: "Public AI Switzerland",
      era: "Collective intelligence",
      detail:
        "When AI became critical infrastructure controlled by a " +
        "handful of foreign corporations, Switzerland did what it has " +
        "always done: built a cooperative.",
      highlight: true,
    },
  ];

  return (
    <section
      id="timeline"
      className="bg-slate-50 py-20"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6
                      md:flex-row">
        <div className="md:w-1/3">
          <h2 className="mb-3 text-2xl font-extrabold">
            A Swiss tradition, continued
          </h2>
          <p className="text-sm text-slate-700">
            Every era of industrial change, Switzerland has responded the
            same way: with cooperatives. Hover over each era to learn more.
          </p>
        </div>
        <div className="relative md:w-2/3">
          <div className="absolute left-4 top-0 h-full w-px bg-orange-200" />
          <ol className="space-y-8 pl-10">
            {items.map((item) => (
              <li
                key={item.year}
                className="relative"
              >
                <div
                  className="absolute left-4 top-1.5 h-3 w-3 -translate-x-1/2
                             rounded-full border-2 border-orange-500
                             bg-white"
                />
                <div className="flex items-start gap-4 pl-8">
                  <div className="min-w-[3.5rem] pt-0.5 text-sm font-extrabold
                                  text-orange-600">
                    {item.year}
                  </div>
                  <div
                    className={`timeline-card flex-1 rounded-lg border
                                border-transparent px-2 py-1 md:px-3 md:py-2 ${
                                  item.highlight
                        ? "border-orange-300 bg-orange-50/60"
                        : ""
                                }`}
                  >
                    <img
                      src={item.logo}
                      alt={item.alt}
                      className="mb-2 h-8 w-auto opacity-80"
                    />
                    <p className="mb-1 text-sm font-semibold text-slate-900">
                      {item.era}
                    </p>
                    <p className="timeline-detail text-xs text-slate-700">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  return (
    <section
      id="compare"
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-6 text-2xl font-extrabold">
          How we compare
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-orange-200 bg-white p-6
                          shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <img
                src="/assets/public-ai-logo.png"
                alt="Public AI Switzerland"
                className="h-7 w-auto"
              />
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide
                               text-slate-500">
                  Cost
                </dt>
                <dd className="font-semibold text-slate-900">
                  CHF 100 / year
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide
                               text-slate-500">
                  Data residency
                </dt>
                <dd className="font-semibold text-slate-900">
                  Switzerland
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide
                               text-slate-500">
                  Ownership
                </dt>
                <dd className="font-semibold text-slate-900">
                  Cooperative — you co-own it
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide
                               text-slate-500">
                  Governance
                </dt>
                <dd className="font-semibold text-slate-900">
                  One member, one vote
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide
                               text-slate-500">
                  Surplus
                </dt>
                <dd className="font-semibold text-slate-900">
                  Reinvested for members
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide
                               text-slate-500">
                  Source code
                </dt>
                <dd className="font-semibold text-slate-900">
                  Open source
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide
                               text-slate-500">
                  Model
                </dt>
                <dd className="font-semibold text-slate-900">
                  Apertus (Swiss-made, open)
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6
                          opacity-90 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">
              ChatGPT (OpenAI)
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide
                               text-slate-500">
                  Cost
                </dt>
                <dd className="font-semibold text-slate-900">
                  CHF 240 / year
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide
                               text-slate-500">
                  Data residency
                </dt>
                <dd className="font-semibold text-slate-900">
                  United States
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide
                               text-slate-500">
                  Ownership
                </dt>
                <dd className="font-semibold text-slate-900">
                  Corporate — shareholders own it
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide
                               text-slate-500">
                  Governance
                </dt>
                <dd className="font-semibold text-slate-900">
                  Board of directors
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide
                               text-slate-500">
                  Surplus
                </dt>
                <dd className="font-semibold text-slate-900">
                  Shareholder dividends
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide
                               text-slate-500">
                  Source code
                </dt>
                <dd className="font-semibold text-slate-900">
                  Closed
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide
                               text-slate-500">
                  Model
                </dt>
                <dd className="font-semibold text-slate-900">
                  GPT (proprietary)
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function AchievementsSection() {
  return (
    <section
      id="achievements"
      className="bg-slate-50 py-20"
    >
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-8 text-2xl font-extrabold">
          Already Serving Switzerland
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          <div
            className="rounded-2xl border border-orange-100 bg-white p-6
                       text-center shadow-sm"
          >
            <div className="text-3xl font-extrabold text-orange-500">
              35,000+
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wide
                            text-slate-500">
              Users Registered
            </div>
          </div>
          <div
            className="rounded-2xl border border-orange-100 bg-white p-6
                       text-center shadow-sm"
          >
            <div className="text-3xl font-extrabold text-orange-500">
              Trillions
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wide
                            text-slate-500">
              Tokens Served
            </div>
          </div>
          <div
            className="rounded-2xl border border-orange-100 bg-white p-6
                       text-center shadow-sm"
          >
            <div className="text-3xl font-extrabold text-orange-500">#1</div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wide
                            text-slate-500">
              Global Deployer of Apertus
            </div>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-700">
          Hundreds of apps, including{" "}
          <a
            href="https://www.liip.ch/en/blog/zuricitygpt-oss-version-using-only-open-source-models"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            ZüriCityGPT OSS
          </a>{" "}
          and{" "}
          <a
            href="https://siliconlovefield.bb.dribdat.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Dribdat
          </a>{" "}
          are being built with our API already. An official{" "}
          <a
            href="https://huggingface.co/blog/inference-providers-publicai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Hugging Face
          </a>{" "}
          enabling all kinds of integrations is available. Active usage from
          universities, commercial research groups, and a growing user community
          attest to the appeal of the solution.
        </p>
      </div>
    </section>
  );
}

function ProductSection() {
  return (
    <section
      id="product"
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-8 text-2xl font-extrabold">
          Two ways to use Public AI
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div
            className="relative rounded-2xl border border-orange-100
                       bg-white p-6 shadow-sm"
          >
            <h3 className="mb-3 text-lg font-semibold text-orange-600">
              For Everyone
            </h3>
            <p className="mb-3 text-sm text-slate-700">
              A friendly chat interface for writing, research, and daily
              tasks—no technical skills needed. Customize your system prompt
              and let built-in memory personalize your experience.
            </p>
            <p className="mb-1 text-sm font-semibold">
              <a
                href="https://chat.publicai.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline
                           underline-offset-4"
              >
                Try the Chat
                <span aria-hidden="true">→</span>
              </a>
            </p>
            <p className="text-xs text-slate-600">
              <a
                href="https://github.com/forpublicai/chat.publicai.co"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                Source Code
              </a>
            </p>
          </div>
          <div
            className="relative rounded-2xl border border-orange-100
                       bg-white p-6 shadow-sm"
          >
            <h3 className="mb-3 text-lg font-semibold text-orange-600">
              For Developers
            </h3>
            <p className="mb-3 text-sm text-slate-700">
              A full API for text generation, embeddings, and retrieval.
              Compatible with the OpenAI API and LiteLLM—switch in one line
              of code.
            </p>
            <p className="mb-1 text-sm font-semibold">
              <a
                href="https://platform.publicai.co/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline
                           underline-offset-4"
              >
                Read the Docs
                <span aria-hidden="true">→</span>
              </a>
            </p>
            <p className="text-xs text-slate-600">
              <a
                href="https://github.com/forpublicai/platform.publicai.co"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                Source Code
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DistributionCta() {
  return (
    <section
      id="distribution"
      className="bg-gradient-to-r from-orange-500 to-rose-600 py-16
                 text-white"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="mb-4 text-2xl font-extrabold">
          Building AI tools?
        </h2>
        <p className="mx-auto max-w-2xl text-sm sm:text-base">
          Startups and companies can distribute their AI tools, systems, and
          agents through our Swiss-hosted cooperative network.
        </p>
        <div className="mt-6">
          <a
            href="mailto:hello@publicai.co?subject=Distribution%20Partnership%20Inquiry"
            className="inline-flex items-center justify-center rounded-full
                       bg-white px-5 py-2 text-xs font-semibold
                       text-orange-600 shadow-sm hover:bg-orange-50"
          >
            Talk To Us About Distribution
          </a>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section
      id="faq"
      className="bg-white py-20"
    >
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="mb-6 text-2xl font-extrabold">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          <details className="rounded-lg border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold">
              Why create a Swiss AI cooperative?
            </summary>
            <p className="mt-2 text-sm text-slate-700">
              Switzerland increasingly relies on foreign AI platforms
              governed from Silicon Valley or Shenzhen, optimized for global
              scale rather than local norms, industries, and communities.
              These platforms have opaque governance and rising prices. It&apos;s
              time for a new model—one we collectively own and control,
              built on Switzerland&apos;s rich tradition of cooperative
              enterprises.
            </p>
          </details>

          <details className="rounded-lg border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold">
              What&apos;s a co-op?
            </summary>
            <p className="mt-2 text-sm text-slate-700">
              A cooperative, or co-op, is a business owned and
              democratically controlled by its members. Public AI
              Switzerland is owned by its membership base of developers,
              institutions, supporters, and workers. Think Migros, Coop,
              Raiffeisen, or Mobility—the same proven model applied to AI
              infrastructure.
            </p>
          </details>

          <details className="rounded-lg border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold">
              How does this compare to ChatGPT/OpenAI?
            </summary>
            <p className="mt-2 text-sm text-slate-700">
              Instead of paying CHF 240 a year for ChatGPT, members pay CHF
              100 to own a piece of their own AI. Heavier API users pay
              transparent overages priced below commercial APIs. All data
              stays in Switzerland, and any surplus is reinvested into
              capacity, lower prices, or community programs—not shareholder
              profits.
            </p>
          </details>

          <details className="rounded-lg border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold">
              Is the platform already live?
            </summary>
            <p className="mt-2 text-sm text-slate-700">
              Yes! We are the primary global deployer of Apertus, with
              35,000+ users and trillions of tokens served. You can try it
              today at{" "}
              <a
                href="https://chat.publicai.co"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                chat.publicai.co
              </a>{" "}
              or access the API at{" "}
              <a
                href="https://platform.publicai.co/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                platform.publicai.co/docs
              </a>
              .
            </p>
          </details>

          <details className="rounded-lg border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold">
              Who can join?
            </summary>
            <p className="mt-2 text-sm text-slate-700">
              Public AI Switzerland is open to Swiss residents and
              companies. We welcome developers, institutions, researchers,
              and supporters who want to collectively own and shape Swiss AI
              infrastructure.
            </p>
          </details>

          <details className="rounded-lg border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold">
              Is this a crypto/blockchain thing?
            </summary>
            <p className="mt-2 text-sm text-slate-700">
              No. Public AI Switzerland is a traditional cooperative
              enterprise, following the proven Swiss cooperative model.
            </p>
          </details>

          <details className="rounded-lg border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold">
              What&apos;s the difference between Public AI Switzerland and
              Public AI?
            </summary>
            <p className="mt-2 text-sm text-slate-700">
              Public AI is a loose movement of people around the world who
              believe that AI should serve the public interest. Public AI
              Switzerland is a legal entity based in Switzerland that is
              affiliated with the movement.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="bg-white">
      <Hero />
      <IntroSection />
      <FoundingMemberCta />
      <TimelineSection />
      <ComparisonSection />
      <AchievementsSection />
      <ProductSection />
      <DistributionCta />
      <FaqSection />
    </div>
  );
}


