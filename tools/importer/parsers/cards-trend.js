/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-trend. Base: cards.
 * Source: https://wknd-trendsetters.site/fashion-trends-of-the-season
 * Generated for xwalk project.
 *
 * Block library (cards): container block. Row 1 = block name.
 *   Each subsequent row = one card with 2 cells:
 *     Cell 1: image (field:image)  — imageAlt collapsed into <img alt>
 *     Cell 2: text  (field:text)   — richtext: title (H3) + description
 * Model (card): image (reference), text (richtext).
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION — validated against source.html
  // Source: direct-child <div>s, each a card containing an img + h3 + p.
  const cards = Array.from(element.querySelectorAll(':scope > div'));

  if (!cards.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const image = card.querySelector('img.cover-image, img');
    const heading = card.querySelector('h3, h4, [class*="heading"]');
    const description = card.querySelector('p.paragraph-sm, p');

    // Cell 1: image (field:image)
    const imageCell = document.createDocumentFragment();
    if (image) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(image);
    }

    // Cell 2: text (field:text) — heading + description as richtext
    const textCell = document.createDocumentFragment();
    if (heading || description) {
      textCell.appendChild(document.createComment(' field:text '));
      if (heading) textCell.appendChild(heading);
      if (description) textCell.appendChild(description);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-trend', cells });
  element.replaceWith(block);
}
