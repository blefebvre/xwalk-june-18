/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters section breaks + section metadata.
 *
 * Runs in afterTransform only. Reads payload.template.sections and, for each
 * section (processed in reverse order so earlier inserts don't shift later
 * lookups):
 *   - inserts an <hr> before the section element when it is not the first
 *     section (section breaks = sections.length - 1),
 *   - creates a "Section Metadata" block after the section element when the
 *     section has a `style` (captured template: only rc6 has style "accent").
 *
 * Section selectors come from page-templates.json (themselves derived from the
 * captured DOM in migration-work/cleaned.html), e.g.:
 *   rc2 #main-content > header.section.secondary-section
 *   rc3 #trends
 *   rc4 #main-content > section.section.secondary-section
 *   rc5 #main-content > section.section:nth-of-type(3)
 *   rc6 #main-content > section.section.accent-section  (style: accent)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && template.sections;
  if (!sections || sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve a section's element from its selector. The selector may be rooted
  // at #main-content; try the document first, then fall back to a scoped query
  // on the element being transformed.
  const resolve = (selector) => {
    if (!selector) return null;
    let el = doc.querySelector(selector);
    if (!el) {
      try {
        el = element.querySelector(selector);
      } catch (e) {
        el = null;
      }
    }
    return el;
  };

  // Process in reverse so inserting <hr>/metadata for later sections does not
  // affect resolution of earlier ones.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const sectionEl = resolve(section.selector);
    if (!sectionEl) continue;

    // Section Metadata block for sections that declare a style.
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (sectionEl.nextSibling) {
        sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
      } else {
        sectionEl.parentNode.appendChild(metaBlock);
      }
    }

    // Section break before every section except the first.
    if (i > 0) {
      const hr = doc.createElement('hr');
      sectionEl.parentNode.insertBefore(hr, sectionEl);
    }
  }
}
