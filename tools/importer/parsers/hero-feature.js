/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-feature. Base: hero.
 * Source: https://wknd-trendsetters.site/fashion-trends-of-the-season
 * Generated for xwalk project.
 *
 * Block: 1 column, simple block. One row per model field group.
 * Model (_hero-feature.json): image, image2, image3 (each reference, single),
 *   imageAlt/image2Alt/image3Alt (collapsed into img alt), text (richtext).
 *   => Rows: image, image2, image3, text.
 * Source structure: two child <div>s — first holds text (h1 + subheading + button-group),
 *   second holds the three stacked images (.cover-image). Each image must map to its own
 *   single-value reference field, so each gets its own row (never multiple images in one cell).
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('.subheading, p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));
  const images = Array.from(element.querySelectorAll('img.cover-image, img'));

  // Empty-block guard
  if (!heading && !subheading && images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  const imageFields = ['image', 'image2', 'image3'];

  // One image per row, each aligned to its own single-value reference field.
  imageFields.forEach((fieldName, i) => {
    const cell = document.createDocumentFragment();
    if (images[i]) {
      cell.appendChild(document.createComment(` field:${fieldName} `));
      cell.appendChild(images[i]);
    }
    // Empty cell when no image: no field hint, empty cell preserved (row alignment).
    cells.push([cell]);
  });

  // Text row (field:text) — heading + subheading + CTAs as richtext.
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading);
  if (subheading) textCell.appendChild(subheading);
  ctaLinks.forEach((a) => textCell.appendChild(a));
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-feature', cells });
  element.replaceWith(block);
}
