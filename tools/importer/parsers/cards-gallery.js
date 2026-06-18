/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site/fashion-trends-of-the-season
 * Generated for xwalk project.
 *
 * Block library (cards): container block. Row 1 = block name.
 *   Each subsequent row = one card with 2 cells:
 *     Cell 1: image (field:image)  — imageAlt collapsed into <img alt>
 *     Cell 2: text  (field:text)   — omitted here; gallery tiles are image-only,
 *                                    so the second cell is left empty (no field hint).
 * Model (card): image (reference), text (richtext).
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION — validated against source.html
  // Source: direct-child <div>s, each an image-only tile containing a single img.
  const tiles = Array.from(element.querySelectorAll(':scope > div'));

  if (!tiles.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  tiles.forEach((tile) => {
    const image = tile.querySelector('img.cover-image, img');

    // Cell 1: image (field:image)
    const imageCell = document.createDocumentFragment();
    if (image) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(image);
    }

    // Cell 2: text — empty (image-only gallery); no field hint on empty cells.
    cells.push([imageCell, '']);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
