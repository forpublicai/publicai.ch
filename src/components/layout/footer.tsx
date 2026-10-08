// Footer chrome: brand red block (old-site tone, global-site red) with white
// links; per-locale tagline, columns and copyright.
// Labels resolve per active locale; targets from config.json ; nested
// `children` render as indented sub-lists.
import { useLocation } from "react-router";
import { getConfig, menuItemTarget } from "~/lib/get-config";
import { localizedLabel, localeFromPath } from "~/lib/locale";
import type { MenuItemValue } from "~/lib/config";

export function Footer() {
  const config = getConfig();
  const { footer } = config;
  const locale = localeFromPath(useLocation().pathname);

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand-block">
            <p className="site-footer__brand">{localizedLabel(config.site.name, locale)}</p>
            {footer.tagline ? (
              <p className="site-footer__tagline">{localizedLabel(footer.tagline, locale)}</p>
            ) : null}
          </div>
          {footer.columns.map((col) => (
            <nav key={col.title.en} aria-label={localizedLabel(col.title, locale)} className="site-footer__col">
              <p className="site-footer__col-title">{localizedLabel(col.title, locale)}</p>
              <ul className="site-footer__col-list">
                {col.items.map((item) => (
                  <FooterLink key={itemKey(item)} item={item} locale={locale} />
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="site-footer__legal">
          <p>{localizedLabel(footer.copyright, locale)}</p>
        </div>
      </div>
    </footer>
  );
}

function itemKey(item: MenuItemValue): string {
  return `${item.label.en}-${item.page ?? item.url ?? ""}`;
}

// One footer link; nested children render as an indented sub-list.
function FooterLink({ item, locale }: { item: MenuItemValue; locale: string }) {
  const hasChildren = !!item.children?.length;
  const external = item.url?.startsWith("http") ?? false;

  return (
    <li>
      {hasChildren ? (
        <p className="site-footer__parent">{localizedLabel(item.label, locale as never)}</p>
      ) : (
        <a
          href={menuItemTarget(item, locale as never)}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {localizedLabel(item.label, locale as never)}
        </a>
      )}
      {item.children ? (
        <ul className="site-footer__sub-list">
          {item.children.map((child) => (
            <FooterLink key={itemKey(child)} item={child} locale={locale} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
