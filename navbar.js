document.addEventListener('DOMContentLoaded', async () => {
  const roots = document.querySelectorAll('[data-navbar-root]');
  if (!roots.length) return;

  try {
    const response = await fetch('/navbar.html');
    if (!response.ok) return;
    const markup = await response.text();

    roots.forEach((root) => {
      root.innerHTML = markup;
    });

    document.querySelectorAll('.nav-toggle').forEach((toggle) => {
      const nav = toggle.closest('nav');
      if (!nav) return;
      toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    const OPEN_COLLECTIVE_CHECKOUT_URL =
      'https://opencollective.com/datalets/projects/public-ai-switzerland/contribute/founding-membership-99202/checkout?interval=year&amount=100&contributeAs=me';

    document.querySelectorAll('.js-join-link').forEach((link) => {
      link.setAttribute('href', OPEN_COLLECTIVE_CHECKOUT_URL);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  } catch (error) {
    // fail silently for now
  }
});

