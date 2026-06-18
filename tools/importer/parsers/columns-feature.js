/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns.
 * Source: https://wknd-trendsetters.site/fashion-trends-of-the-season
 * Generated for xwalk project.
 *
 * Block library (columns): row 1 = block name; row 2 = N column cells.
 * This variant is a 2-column layout: image-left, text-right (H3 + paragraph + CTA).
 * NOTE: Columns blocks (core/franklin/components/columns) must NOT include field hints —
 *       cells contain default content only (per hinting rules).
 */
export default function parse(element, { document }) {
  // INPUT EXTRACTION — validated against source.html
  // Source: two child <div>s — first holds the image, second holds heading + paragraph + button-group.
  const childDivs = Array.from(element.querySelectorAll(':scope > div'));

  const image = element.querySelector('img.cover-image, img');
  const heading = element.querySelector('h3, h2, .h3-heading, [class*="heading"]');
  const paragraph = element.querySelector('p.paragraph-lg, p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard
  if (!image && !heading && !paragraph) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Left column: image
  const leftCell = [];
  if (image) leftCell.push(image);

  // Right column: heading + paragraph + CTA(s)
  const rightCell = [];
  if (heading) rightCell.push(heading);
  if (paragraph) rightCell.push(paragraph);
  ctaLinks.forEach((a) => rightCell.push(a));

  const cells = [[leftCell, rightCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
