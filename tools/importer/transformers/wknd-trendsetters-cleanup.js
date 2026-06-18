/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 *
 * All selectors are taken from the captured DOM in migration-work/cleaned.html.
 * This is a Webflow/Astro-style site (wknd-trendsetters.site). Authorable page
 * content lives inside <main id="main-content">; everything else (skip link,
 * navbar/mega-menu chrome, footer) is global shell that authors do not edit.
 *
 * IMPORTANT: The hero section inside <main> is itself an authorable
 * <header class="section secondary-section">. Do NOT remove the bare `header`
 * tag — that would delete the hero. Only the global `.navbar` and `.footer`
 * shells are removed, by their specific captured classes.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Global navigation / mega-menu shell and skip link (captured DOM):
    //   <a class="skip-link">, <div class="navbar">, <nav id="nav-menu">,
    //   <button id="nav-toggle">
    // Removed before parsing so block matching only sees in-main content.
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      '.navbar',
      '#nav-menu',
      '#nav-toggle',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Global footer shell (captured DOM): <footer class="footer inverse-footer">.
    // Targeted by class so the in-main hero <header> is never matched.
    WebImporter.DOMUtils.remove(element, [
      'footer.footer',
      'noscript',
      'link',
      'iframe',
    ]);

    // Strip framework wrapper artifacts: Astro scoping attributes left on
    // elements (captured DOM: data-astro-cid-37fxchfa on <body>).
    element.querySelectorAll('[data-astro-cid-37fxchfa]').forEach((el) => {
      el.removeAttribute('data-astro-cid-37fxchfa');
    });
  }
}
