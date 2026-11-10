// Zod schema for config.json. One human-editable file;
// validated at build/dev time with errors naming the offending config path.
import { z } from "zod";

// Site locales, in switcher order.
export const LOCALES = ["en", "de", "fr", "it", "rm"] as const;
export type Locale = (typeof LOCALES)[number];

// Email schema: accepts any RFC-style address; the seed config carries the
// documented CONTACT_EMAIL_PLACEHOLDER open item which build reports
// surface as a warning until the user supplies the real address.
export const EmailAddress = z.string().refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
  message: "Must be a valid email address",
});

// LocalizedString: object with EXACTLY the keys in site.locales.
export const LocalizedString = z
  .record(z.enum(LOCALES), z.string().min(1))
  .refine((obj) => LOCALES.every((l) => l in obj), {
    message: "Missing locale key(s); every locale in site.locales is required",
  });

// MenuItem: page | url | children, mutually exclusive.
export const MenuItem: z.ZodType<MenuItemValue> = z.lazy(() =>
  z
    .object({
      label: LocalizedString,
      page: z.string().optional(),
      url: z.string().optional(),
      children: z.array(MenuItem).optional(),
    })
    .refine(
      (item) =>
        [item.page !== undefined, item.url !== undefined, item.children !== undefined].filter(
          Boolean,
        ).length === 1,
      { message: "MenuItem must have exactly one of: page, url, children" },
    )
    .refine((item) => item.children === undefined || item.children.length > 0, {
      message: "children must be a non-empty array",
    }),
);

export type MenuItemValue = {
  label: Record<Locale, string>;
  page?: string;
  url?: string;
  children?: MenuItemValue[];
};

export const ConfigSchema = z.object({
  site: z.object({
    name: LocalizedString,
    canonicalBase: z.string().url(),
    defaultLocale: z.literal("en"), // EN-root hard-coded in v1 (§ 5 rule 3)
    locales: z.array(z.enum(LOCALES)).min(1),
  }),
  menus: z.object({
    main: z.array(MenuItem),
    utility: z.array(MenuItem),
    cta: MenuItem.optional(),
  }),
  footer: z.object({
    tagline: LocalizedString.optional(),
    columns: z.array(
      z.object({
        title: LocalizedString,
        items: z.array(MenuItem),
      }),
    ),
    copyright: LocalizedString,
  }),
  pages: z.object({
    excluded: z.array(z.string()),
    redirects: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
      }),
    ),
  }),
  home: z.object({
    sections: z.object({
      apertusPrompt: z.boolean().default(false),
    }),
  }),
  embeds: z.object({
    allowlist: z.array(z.string()),
  }),
  contact: z.object({
    email: EmailAddress,
  }),
  news: z.object({
    authorsEnabled: z.boolean().default(true),
    categories: z.array(z.string()),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;
