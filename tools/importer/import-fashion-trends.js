/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroFeatureParser from './parsers/hero-feature.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsTrendParser from './parsers/cards-trend.js';
import cardsGalleryParser from './parsers/cards-gallery.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-feature': heroFeatureParser,
  'columns-feature': columnsFeatureParser,
  'cards-trend': cardsTrendParser,
  'cards-gallery': cardsGalleryParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'fashion-trends',
  description: 'Fashion trends editorial landing page with hero, trend alert feature, trend cards grid, image gallery, and newsletter CTA',
  urls: [
    'https://wknd-trendsetters.site/fashion-trends-of-the-season',
  ],
  blocks: [
    {
      name: 'hero-feature',
      instances: [
        '#main-content > header.section.secondary-section > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl',
      ],
    },
    {
      name: 'columns-feature',
      instances: [
        '#trends > div.container > div.grid-layout.tablet-1-column.grid-gap-lg',
      ],
    },
    {
      name: 'cards-trend',
      instances: [
        '#main-content > section.section.secondary-section > div.container > div.grid-layout.desktop-3-column.tablet-1-column.grid-gap-lg',
      ],
    },
    {
      name: 'cards-gallery',
      instances: [
        '#main-content > section.section:nth-of-type(3) > div.container > div.grid-layout.desktop-3-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm',
      ],
    },
  ],
  sections: [
    {
      id: 'rc2',
      name: 'Hero / page header',
      selector: '#main-content > header.section.secondary-section',
      style: null,
      blocks: ['hero-feature'],
      defaultContent: [],
    },
    {
      id: 'rc3',
      name: 'Trend alert feature',
      selector: '#trends',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [
        '#trends > div.container > div.utility-text-align-center > h2.h2-heading',
        '#trends > div.container > div.utility-text-align-center > p.paragraph-lg',
      ],
    },
    {
      id: 'rc4',
      name: 'Trends that turn heads',
      selector: '#main-content > section.section.secondary-section',
      style: null,
      blocks: ['cards-trend'],
      defaultContent: [
        '#main-content > section.section.secondary-section > div.container > div.utility-text-align-center > h2.h2-heading',
      ],
    },
    {
      id: 'rc5',
      name: 'Style in every snapshot',
      selector: '#main-content > section.section:nth-of-type(3)',
      style: null,
      blocks: ['cards-gallery'],
      defaultContent: [
        '#main-content > section.section:nth-of-type(3) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem > h2.h2-heading',
        '#main-content > section.section:nth-of-type(3) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem > p.paragraph-lg',
      ],
    },
    {
      id: 'rc6',
      name: 'Newsletter CTA',
      selector: '#main-content > section.section.accent-section',
      style: 'accent',
      blocks: [],
      defaultContent: [
        '#main-content > section.section.accent-section > div.container',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, sections last
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
