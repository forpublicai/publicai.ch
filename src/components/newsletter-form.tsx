// Newsletter sign-up form (Infomaniak webforms, one per language), used by
// the home newsletter section (full) and the footer (compact). Own markup and styling
// instead of Infomaniak's embed: the form fields, hidden key and honeypots
// mirror the generated integration code, and submission uses the same
// JSONP GET protocol as Infomaniak's webform_index.js (no jQuery). Only the
// ALTCHA widget script is loaded from Infomaniak (spam protection, checked
// server-side). On success the visitor lands on the hidden, locale-matched
// /newsletter-confirmation/ page.
import { useEffect, useId, useState, type FormEvent } from "react";
import type { Locale } from "~/lib/config";
import { localeHref } from "~/lib/locale";

// One Infomaniak webform per language, because each form carries its own
// confirmation email. The name fields are optional; their meta ids differ
// per form.
type Webform = { id: string; key: string; firstNameField: string; lastNameField: string };

const FORMS: Record<Locale, Webform> = {
  de: {
    id: "26266",
    key: "eyJpdiI6IkN4a3JKSk5BRzZ2ejFSXC9RRmVLT3BKeDNOK252V1FIODVCMGhOZTNGM2FZPSIsIm1hYyI6ImMzNDU2ZjZlOGVhYzlkN2M3NWMwNzEyZmJiMjliN2VlMDNiNTYyMmVkNzIyYzdmODkyNDdkOWMwZWE2YTQ3YzAiLCJ2YWx1ZSI6InpRNHFhRklRM2NDTW1vdjhXclRwMENiV3hHN01RNGk0c1Y4cVorZ0IyQ289In0=",
    firstNameField: "93160",
    lastNameField: "93161",
  },
  fr: {
    id: "26267",
    key: "eyJpdiI6ImpDZVRKam9hZzBIWU5USmxpNXFHeEpjTSttWllHdUoxUWtIMm9PQTRKc2s9IiwibWFjIjoiNTkxNzRjY2I2M2QyOTQ1YTQzODVlZDk1MjBiMTYyYjFlOTU5ZjhkY2YxNTY2OGRkNWY3OWMyY2E0YmU5NTAwYyIsInZhbHVlIjoiOHVpWXA0U1ZRdHZDcnd2ZG9SbHA0emFZMThPY3B1TitxMzl4TTRNK3JDTT0ifQ==",
    firstNameField: "93158",
    lastNameField: "93159",
  },
  it: {
    id: "26268",
    key: "eyJpdiI6IjVkczJTUzNkQ2IxV0wyV1wvQk5VNW9tcVVcL2FRWDJmclljdGE0ZzVVSnVIVT0iLCJtYWMiOiIyYWFjMTg4MTQ3ZmUxZmUwYTU5MjIxN2Q1MDMzYmU1OGFlZGMwOWRiZDVkMDkxZjJjN2JkNzgwYjE0Y2UxZDk4IiwidmFsdWUiOiJFOXJZeDJlOVpoSmxsU2k2bThJdkt0V3lRSWV0ZW1zVFRpSnpLdU5cLzhYUT0ifQ==",
    firstNameField: "93156",
    lastNameField: "93157",
  },
  rm: {
    id: "26269",
    key: "eyJpdiI6InRaV3JhRVMwaWViY2JWNVNaYkE3cWlyRWlja3JWU2ZZMFR3NWFudWZyRjA9IiwibWFjIjoiYjE4NzNhM2FjOTYyMzM1YTM5ZjRkMGVmOTg1ODk4YjFjN2VmMjA5ZGFlNzU0ZTRhOGZmZjQ5ZjM1YmU4NDBmYSIsInZhbHVlIjoiREZcL2N2VXR0MGZVNkE1YlcwaEg1UUFZcHVuRVZsNnBUeXBwTkJGUGh5blU9In0=",
    firstNameField: "93154",
    lastNameField: "93155",
  },
  en: {
    id: "24104",
    key: "eyJpdiI6ImU4OHg0UmFYR2JmMnZTVCsyZzdqaFBQVU1ZK2dsSVNMQ0UxRFZTbnRcLzlJPSIsIm1hYyI6IjU3ODMxMDAwYWE2YTc3NTE5ZGI0YzUzNzNkZWM5NDA2NDBiYjgwYzFlYWE5NWJlMjdlZDQ3MWNmZjM1YTQyNWMiLCJ2YWx1ZSI6Ikpya1U0NEh4RjV5a1dGamNXYWJHSGNDQkd0dnVwZDBabURaU3crK0l6ZWc9In0=",
    firstNameField: "84863",
    lastNameField: "93126",
  },
};

const submitUrl = (form: Webform) => `https://newsletter.infomaniak.com/v3/api/1/newsletters/webforms/${form.id}/submit`;
const ALTCHA_SCRIPT = "https://newsletter.infomaniak.com/v3/static/mcaptcha/altcha.min.js";
const ALTCHA_CHALLENGE = "https://newsletter.infomaniak.com/v3/altcha-challenge";
const EMAIL_FIELD = "1";

export const NEWSLETTER_STRINGS: Record<
  Locale,
  {
    kicker: string;
    footerTitle: string;
    heading: string;
    lead: string;
    email: string;
    firstName: string;
    lastName: string;
    submit: string;
    sending: string;
    privacy: string;
    invalidEmail: string;
    failed: string;
    altcha: Record<string, string>;
  }
> = {
  de: {
    kicker: "Newsletter",
    footerTitle: "Newsletter abonnieren",
    heading: "Bleib informiert",
    lead: "Erhalte Neuigkeiten von Public AI Switzerland: unsere Fortschritte, kommende Anlässe und Möglichkeiten, dich einzubringen.",
    email: "E-Mail-Adresse",
    firstName: "Vorname (optional)",
    lastName: "Nachname (optional)",
    submit: "Anmelden",
    sending: "Wird gesendet …",
    privacy:
      "Deine E-Mail-Adresse verwenden wir nur für unseren Newsletter und Informationen zu unseren Aktivitäten. Du kannst dich jederzeit über den Link in jeder E-Mail abmelden.",
    invalidEmail: "Bitte gib eine gültige E-Mail-Adresse ein.",
    failed: "Die Anmeldung hat nicht geklappt. Bitte versuche es später erneut.",
    altcha: {
      error: "Überprüfung fehlgeschlagen. Bitte versuche es später erneut.",
      expired: "Überprüfung abgelaufen. Bitte erneut versuchen.",
      label: "Ich bin kein Roboter",
      verified: "Überprüft",
      verifying: "Wird überprüft …",
      waitAlert: "Wird überprüft … bitte warten.",
    },
  },
  en: {
    kicker: "Newsletter",
    footerTitle: "Subscribe to our newsletter",
    heading: "Stay informed",
    lead: "Receive updates on Public AI Switzerland: our progress, upcoming events and ways to get involved.",
    email: "Email address",
    firstName: "First name (optional)",
    lastName: "Last name (optional)",
    submit: "Sign up",
    sending: "Sending …",
    privacy:
      "We only use your email address to send you our newsletter and information about our activities. You can unsubscribe at any time using the link in each email.",
    invalidEmail: "Please enter a valid email address.",
    failed: "The sign-up didn't work. Please try again later.",
    altcha: {
      error: "Verification failed. Try again later.",
      expired: "Verification expired. Try again.",
      label: "I am not a robot",
      verified: "Verified",
      verifying: "Verifying …",
      waitAlert: "Verifying … please wait.",
    },
  },
  fr: {
    kicker: "Newsletter",
    footerTitle: "S'abonner à la newsletter",
    heading: "Reste informé",
    lead: "Reçois les nouvelles de Public AI Switzerland : nos avancées, les prochains événements et les façons de t'impliquer.",
    email: "Adresse e-mail",
    firstName: "Prénom (facultatif)",
    lastName: "Nom (facultatif)",
    submit: "S'inscrire",
    sending: "Envoi en cours …",
    privacy:
      "Nous utilisons ton adresse e-mail uniquement pour t'envoyer notre newsletter et des informations sur nos activités. Tu peux te désinscrire à tout moment grâce au lien présent dans chaque e-mail.",
    invalidEmail: "Merci de saisir une adresse e-mail valide.",
    failed: "L'inscription n'a pas fonctionné. Merci de réessayer plus tard.",
    altcha: {
      error: "Échec de la vérification. Réessaie plus tard.",
      expired: "Vérification expirée. Réessaie.",
      label: "Je ne suis pas un robot",
      verified: "Vérifié",
      verifying: "Vérification en cours …",
      waitAlert: "Vérification en cours … merci de patienter.",
    },
  },
  it: {
    kicker: "Newsletter",
    footerTitle: "Iscriviti alla newsletter",
    heading: "Resta aggiornato",
    lead: "Ricevi le novità di Public AI Switzerland: i nostri progressi, i prossimi eventi e i modi per partecipare.",
    email: "Indirizzo e-mail",
    firstName: "Nome (facoltativo)",
    lastName: "Cognome (facoltativo)",
    submit: "Iscriviti",
    sending: "Invio in corso …",
    privacy:
      "Usiamo il tuo indirizzo e-mail solo per inviarti la nostra newsletter e informazioni sulle nostre attività. Puoi annullare l'iscrizione in qualsiasi momento tramite il link presente in ogni e-mail.",
    invalidEmail: "Inserisci un indirizzo e-mail valido.",
    failed: "L'iscrizione non è andata a buon fine. Riprova più tardi.",
    altcha: {
      error: "Verifica fallita. Riprova più tardi.",
      expired: "Verifica scaduta. Riprova.",
      label: "Non sono un robot",
      verified: "Verificato",
      verifying: "Verifica in corso …",
      waitAlert: "Verifica in corso … attendere.",
    },
  },
  rm: {
    kicker: "Newsletter",
    footerTitle: "Abunar il newsletter",
    heading: "Resta infurmà",
    lead: "Survegna novitads da Public AI Switzerland: noss progress, proxims eveniments e pussaivladads da t'engaschar.",
    email: "Adressa dad e-mail",
    firstName: "Prenum (facultativ)",
    lastName: "Num (facultativ)",
    submit: "Annunziar",
    sending: "Vegn tramess …",
    privacy:
      "Nus duvrain tia adressa dad e-mail mo per ta trametter noss newsletter ed infurmaziuns davart nossas activitads. Ti pos ta deslocar da tut temp cun la colliaziun en mintga e-mail.",
    invalidEmail: "Endatescha per plaschair ina adressa dad e-mail valida.",
    failed: "L'annunzia n'ha betg funcziunà. Emprova pli tard anc ina giada.",
    altcha: {
      error: "La verificaziun n'ha betg funcziunà. Emprova pli tard anc ina giada.",
      expired: "La verificaziun è scadida. Emprova anc ina giada.",
      label: "Jau n'sun nagin robot",
      verified: "Verifitgà",
      verifying: "Vegn verifitgà …",
      waitAlert: "Vegn verifitgà … spetga per plaschair.",
    },
  },
};

type InfomaniakResult = { err?: Record<string, string>; redir?: string };

declare global {
  interface Window {
    jsonCallback?: (result: InfomaniakResult) => void;
  }
}

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "altcha-widget": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        hidelogo?: string;
        hidefooter?: string;
        challengeurl?: string;
        strings?: string;
      };
    }
  }
}

// Infomaniak's endpoint answers JSONP with the fixed callback name its own
// script uses ("jsonCallback"), so mirror that exactly.
function submitJsonp(action: string, params: URLSearchParams): Promise<InfomaniakResult> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const cleanup = () => {
      delete window.jsonCallback;
      script.remove();
    };
    window.jsonCallback = (result) => {
      cleanup();
      resolve(result);
    };
    params.set("callback", "jsonCallback");
    params.set("_", String(Date.now()));
    script.src = `${action}?${params.toString()}`;
    script.onerror = () => {
      cleanup();
      reject(new Error("network"));
    };
    document.head.appendChild(script);
  });
}

export function NewsletterForm({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const t = NEWSLETTER_STRINGS[locale];
  const webform = FORMS[locale];
  const errorId = useId();
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  // The spam check only appears once someone starts entering an email.
  const [showAltcha, setShowAltcha] = useState(false);
  const [error, setError] = useState<{ field?: "email"; message: string } | null>(null);

  // Load the ALTCHA web component once (client only).
  useEffect(() => {
    if (customElements.get("altcha-widget") || document.querySelector(`script[src="${ALTCHA_SCRIPT}"]`)) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = ALTCHA_SCRIPT;
    document.head.appendChild(script);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    setError(null);
    setStatus("sending");
    const params = new URLSearchParams();
    new FormData(form).forEach((value, name) => {
      if (typeof value === "string") params.append(name, value);
    });
    try {
      const result = await submitJsonp(submitUrl(webform), params);
      const errors = Object.entries(result.err ?? {});
      if (errors.length === 0) {
        window.location.href = localeHref("/newsletter-confirmation", locale);
        return;
      }
      const altcha = form.querySelector("altcha-widget") as (HTMLElement & { reset?: () => void }) | null;
      const emailError = errors.some(([field]) => field === EMAIL_FIELD);
      if (errors.some(([, value]) => value === "altcha")) altcha?.reset?.();
      setError(emailError ? { field: "email", message: t.invalidEmail } : { message: t.failed });
    } catch {
      setError({ message: t.failed });
    }
    setStatus("idle");
  }

  // Compact (footer): labels stay for screen readers, placeholders show them.
  const labelClass = compact ? "visually-hidden" : undefined;
  const placeholder = (label: string) => (compact ? label : undefined);

  return (
    <form
      className={compact ? "newsletter-form newsletter-form--compact" : "newsletter-form"}
      method="post"
      action={submitUrl(webform)}
      onSubmit={onSubmit}
    >
      {/* Honeypots + form identity, as in Infomaniak's integration code. */}
      <input type="text" name="inf_email_check" autoComplete="off" tabIndex={-1} aria-hidden="true" hidden />
      <input type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden="true" className="newsletter-form__trap" />
      <input type="hidden" name="key" value={webform.key} />
      <input type="hidden" name="webform_id" value={webform.id} />

      <label className="newsletter-form__field">
        <span className={labelClass}>{t.email}</span>
        <input
          type="email"
          name="inf[1]"
          data-inf-meta="1"
          required
          autoComplete="email"
          onChange={(event) => {
            if (event.currentTarget.value.trim() !== "") setShowAltcha(true);
          }}
          placeholder={placeholder(t.email)}
          aria-invalid={error?.field === "email" ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      </label>
      <div className="newsletter-form__names">
        <label className="newsletter-form__field">
          <span className={labelClass}>{t.firstName}</span>
          <input
            type="text"
            name={`inf[${webform.firstNameField}]`}
            data-inf-meta={webform.firstNameField}
            autoComplete="given-name"
            placeholder={placeholder(t.firstName)}
          />
        </label>
        <label className="newsletter-form__field">
          <span className={labelClass}>{t.lastName}</span>
          <input
            type="text"
            name={`inf[${webform.lastNameField}]`}
            data-inf-meta={webform.lastNameField}
            autoComplete="family-name"
            placeholder={placeholder(t.lastName)}
          />
        </label>
      </div>

      {showAltcha ? (
        <altcha-widget hidelogo="" hidefooter="" challengeurl={ALTCHA_CHALLENGE} strings={JSON.stringify(t.altcha)} />
      ) : null}

      {error ? (
        <p id={errorId} className="newsletter-form__error" role="alert">
          {error.message}
        </p>
      ) : null}

      <button type="submit" className="pill pill--primary newsletter-form__submit" disabled={status === "sending"}>
        {status === "sending" ? t.sending : t.submit}
      </button>
      {compact ? null : <p className="newsletter-form__privacy">{t.privacy}</p>}
    </form>
  );
}
