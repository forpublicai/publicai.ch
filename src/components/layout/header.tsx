// Two-row site header with language selection, utility links, main navigation,
// and a mobile menu. Nested menus use disclosure buttons with keyboard and
// outside-click handling. All labels and targets resolve in the current locale.
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { getConfig, menuItemTarget } from "~/lib/get-config";
import { localizedLabel, localeFromPath, localeHome } from "~/lib/locale";
import { chromeStrings } from "~/lib/chrome-strings";
import type { MenuItemValue, Locale } from "~/lib/config";
import { LanguageSwitcherRow } from "~/components/layout/language-switcher";

// Map locale → old-site logo asset.
const LOGO_BY_LOCALE: Record<Locale, string> = {
  en: "/assets/logos/logo-switzerland-en.png",
  de: "/assets/logos/logo-switzerland-de.png",
  fr: "/assets/logos/logo-switzerland-fr.png",
  it: "/assets/logos/logo-switzerland-it.png",
  rm: "/assets/logos/logo-switzerland-rm.png",
};

export function Header() {
  const config = getConfig();
  const { main, utility, cta } = config.menus;
  const navigate = useNavigate();
  const location = useLocation();
  const currentLocale = localeFromPath(location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Dropdown open-state is NAMESPACED per render context ("d" desktop nav,
  // "m" mobile panel): the same config item renders in BOTH subtrees (the
  // desktop one is CSS-hidden on mobile) and sharing one key made the two
  // copies toggle each other — the mobile panel could never collapse
  // (fix for the Session-27 toggle bug).
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenus({});
  }, [location.pathname]);

  function go(item: MenuItemValue): void {
    setMobileOpen(false);
    if (item.url) {
      window.location.href = item.url;
      return;
    }
    if (item.page) void navigate(menuItemTarget(item, currentLocale));
  }

  function toggleMenu(key: string): void {
    setOpenMenus((s) => ({ ...s, [key]: !s[key] }));
  }

  const brandAlt = localizedLabel(config.site.name, currentLocale);
  // Fixed "home in the current locale" target (NOT same-path): on a 404 the
  // same-path construction would keep the unknown URL as the logo target.
  const brandHref = localeHome(currentLocale);

  return (
    <header className="site-header">
      {/* Row 1 — utility: languages (left) + global/external links (right) */}
      <div className="site-header__utilityrow">
        <div className="site-header__utilityrow-inner">
          <LanguageSwitcherRow locales={config.site.locales} current={currentLocale} />
          <nav className="site-header__utility" aria-label={chromeStrings.nav.global[currentLocale]}>
            <ul className="site-header__utility-list">
              {utility.map((item) =>
                renderUtility(item, currentLocale, { onNavigate: go, openMenus, toggleMenu, context: "d" }),
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* Row 2 — main: logo (left) + main menu + CTA (right) */}
      <div className="site-header__mainrow">
        <div className="site-header__mainrow-inner">
          <a href={brandHref} className="site-header__brand" aria-label={brandAlt}>
            <img src={LOGO_BY_LOCALE[currentLocale]} alt={brandAlt} className="site-header__logo" />
          </a>
          <nav className="site-header__nav" aria-label={chromeStrings.nav.main[currentLocale]}>
            <ul className="site-header__nav-list">
              {main.map((item) => renderMenu(item, currentLocale, { onNavigate: go, openMenus, toggleMenu, context: "d" }))}
            </ul>
          </nav>
          <div className="site-header__actions">
            {cta ? (
              <a href={menuItemTarget(cta, currentLocale)} className="pill pill--primary site-header__cta">
                {localizedLabel(cta.label, currentLocale)}
              </a>
            ) : null}
            <button
              type="button"
              className="site-header__toggle"
              aria-expanded={mobileOpen}
              aria-controls="site-mobile-menu"
              aria-label={chromeStrings.nav.toggleNavigation[currentLocale]}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="site-header__toggle-bar" />
              <span className="site-header__toggle-bar" />
              <span className="site-header__toggle-bar" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel: both menu rows fold in here */}
      {mobileOpen ? (
        <nav className="site-header__mobile" id="site-mobile-menu" aria-label={chromeStrings.nav.main[currentLocale]}>
          <ul className="site-header__mobile-list">
            {main.map((item) => renderMenu(item, currentLocale, { onNavigate: go, openMenus, toggleMenu, context: "m", mobile: true }))}
            <li className="site-header__mobile-sep" aria-hidden="true" />
            {utility.map((item) =>
              renderUtility(item, currentLocale, { onNavigate: go, openMenus, toggleMenu, context: "m", mobile: true }),
            )}
            {cta ? (
              <li key="cta" className="site-header__mobile-cta">
                <a href={menuItemTarget(cta, currentLocale)} className="pill pill--primary">
                  {localizedLabel(cta.label, currentLocale)}
                </a>
              </li>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

// Dropdown state key: `label|target@context`. The context suffix keeps the
// desktop and mobile copies of the same item independent (see Header note).
function keyOf(item: MenuItemValue, context: "d" | "m"): string {
  return `${context}@${item.label.en}-${item.page ?? item.url ?? ""}`;
}

// Shared menu-context passed by Header into the render helpers; `context`
// namespaces dropdown state, `mobile` selects mobile styling + navigation.
type MenuCtx = {
  onNavigate: (item: MenuItemValue) => void;
  openMenus: Record<string, boolean>;
  toggleMenu: (key: string) => void;
  context: "d" | "m";
  mobile?: boolean;
};

function renderUtility(
  item: MenuItemValue,
  locale: Locale,
  ctx?: MenuCtx
) {
  const key = keyOf(item, ctx?.context ?? "d");
  // Nested `children` in the utility row use the same accessible
  // disclosure dropdown as the main menu.
  if (item.children?.length && ctx) {
    return (
      <DropdownMenu
        key={key}
        item={item}
        locale={locale}
        open={!!ctx.openMenus[key]}
        onToggle={() => ctx.toggleMenu(key)}
        onNavigate={ctx.onNavigate}
        mobile={ctx.mobile}
      />
    );
  }
  if (item.children?.length) {
    // No ctx (defensive): render a label-only container.
    return <li key={key}><span className="site-header__parent-label">{localizedLabel(item.label, locale)}</span></li>;
  }
  const external = item.url?.startsWith("http") ?? false;
  return (
    <li key={key} className={ctx?.mobile ? "site-header__utility-item--mobile" : undefined}>
      <a
        href={menuItemTarget(item, locale)}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {localizedLabel(item.label, locale)}
      </a>
    </li>
  );
}

function renderMenu(
  item: MenuItemValue,
  locale: Locale,
  ctx: MenuCtx
) {
  const key = keyOf(item, ctx.context);
  const open = !!ctx.openMenus[key];
  const hasChildren = !!item.children?.length;

  if (hasChildren) {
    return (
      <DropdownMenu
        key={key}
        item={item}
        locale={locale}
        open={open}
        onToggle={() => ctx.toggleMenu(key)}
        onNavigate={ctx.onNavigate}
        mobile={ctx.mobile}
      />
    );
  }
  return (
    <li key={key} className="site-header__menu-item">
      <a href={menuItemTarget(item, locale)}>{localizedLabel(item.label, locale)}</a>
    </li>
  );
}

// Nested menu disclosure: Enter/Space opens via the native button; Esc closes and
// refocuses the trigger; click-outside closes; the header's location effect
// resets all dropdowns on navigation.
//
// Outside-click correctness: a hidden copy of the same item
// exists in the other render context (the desktop utility nav is CSS-hidden
// on mobile but still mounted). The `offsetParent` guard makes those hidden
// copies inert — without it, their outside-click handler fired alongside the
// mobile panel's, which caused the collapse-then-instantly-reopen race.
function DropdownMenu({
  item,
  locale,
  open,
  onToggle,
  onNavigate,
  mobile,
}: {
  item: MenuItemValue;
  locale: Locale;
  open: boolean;
  onToggle: () => void;
  onNavigate: (item: MenuItemValue) => void;
  mobile?: boolean;
}) {
  const rootRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape" && rootRef.current?.offsetParent !== null) {
        onToggle();
        const trigger = rootRef.current?.querySelector<HTMLButtonElement>(".site-header__menu-btn");
        trigger?.focus();
      }
    }
    function onClickOutside(event: MouseEvent): void {
      // This copy is display:none (hidden in the other context) → inert.
      if (rootRef.current?.offsetParent === null) return;
      if (!rootRef.current?.contains(event.target as Node)) onToggle();
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open, onToggle]);

  return (
    <li ref={rootRef} className="site-header__menu-item">
      <button
        type="button"
        className="site-header__menu-btn"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={onToggle}
      >
        {localizedLabel(item.label, locale)}
        <span className="site-header__chevron" aria-hidden="true" />
      </button>
      {open ? (
        <ul className={mobile ? "site-header__submenu site-header__submenu--mobile" : "site-header__submenu"}>
          {item.children!.map((child) => (
            <li key={keyOf(child, mobile ? "m" : "d")}>
              <a href={menuItemTarget(child, locale)} onClick={() => onNavigate(child)}>
                {localizedLabel(child.label, locale)}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}