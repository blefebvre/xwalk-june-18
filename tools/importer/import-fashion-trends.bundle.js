/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-fashion-trends.js
  var import_fashion_trends_exports = {};
  __export(import_fashion_trends_exports, {
    default: () => import_fashion_trends_default
  });

  // tools/importer/parsers/hero-feature.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector(".subheading, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const images = Array.from(element.querySelectorAll("img.cover-image, img"));
    if (!heading && !subheading && images.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    const imageFields = ["image", "image2", "image3"];
    imageFields.forEach((fieldName, i) => {
      const cell = document.createDocumentFragment();
      if (images[i]) {
        cell.appendChild(document.createComment(` field:${fieldName} `));
        cell.appendChild(images[i]);
      }
      cells.push([cell]);
    });
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) textCell.appendChild(heading);
    if (subheading) textCell.appendChild(subheading);
    ctaLinks.forEach((a) => textCell.appendChild(a));
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse2(element, { document }) {
    const childDivs = Array.from(element.querySelectorAll(":scope > div"));
    const image = element.querySelector("img.cover-image, img");
    const heading = element.querySelector('h3, h2, .h3-heading, [class*="heading"]');
    const paragraph = element.querySelector("p.paragraph-lg, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    if (!image && !heading && !paragraph) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const leftCell = [];
    if (image) leftCell.push(image);
    const rightCell = [];
    if (heading) rightCell.push(heading);
    if (paragraph) rightCell.push(paragraph);
    ctaLinks.forEach((a) => rightCell.push(a));
    const cells = [[leftCell, rightCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-trend.js
  function parse3(element, { document }) {
    const cards = Array.from(element.querySelectorAll(":scope > div"));
    if (!cards.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector("img.cover-image, img");
      const heading = card.querySelector('h3, h4, [class*="heading"]');
      const description = card.querySelector("p.paragraph-sm, p");
      const imageCell = document.createDocumentFragment();
      if (image) {
        imageCell.appendChild(document.createComment(" field:image "));
        imageCell.appendChild(image);
      }
      const textCell = document.createDocumentFragment();
      if (heading || description) {
        textCell.appendChild(document.createComment(" field:text "));
        if (heading) textCell.appendChild(heading);
        if (description) textCell.appendChild(description);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-trend", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse4(element, { document }) {
    const tiles = Array.from(element.querySelectorAll(":scope > div"));
    if (!tiles.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    tiles.forEach((tile) => {
      const image = tile.querySelector("img.cover-image, img");
      const imageCell = document.createDocumentFragment();
      if (image) {
        imageCell.appendChild(document.createComment(" field:image "));
        imageCell.appendChild(image);
      }
      cells.push([imageCell, ""]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        ".navbar",
        "#nav-menu",
        "#nav-toggle"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "footer.footer",
        "noscript",
        "link",
        "iframe"
      ]);
      element.querySelectorAll("[data-astro-cid-37fxchfa]").forEach((el) => {
        el.removeAttribute("data-astro-cid-37fxchfa");
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && template.sections;
    if (!sections || sections.length < 2) return;
    const doc = element.ownerDocument;
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
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = resolve(section.selector);
      if (!sectionEl) continue;
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(metaBlock);
        }
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }

  // tools/importer/import-fashion-trends.js
  var parsers = {
    "hero-feature": parse,
    "columns-feature": parse2,
    "cards-trend": parse3,
    "cards-gallery": parse4
  };
  var PAGE_TEMPLATE = {
    name: "fashion-trends",
    description: "Fashion trends editorial landing page with hero, trend alert feature, trend cards grid, image gallery, and newsletter CTA",
    urls: [
      "https://wknd-trendsetters.site/fashion-trends-of-the-season"
    ],
    blocks: [
      {
        name: "hero-feature",
        instances: [
          "#main-content > header.section.secondary-section > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl"
        ]
      },
      {
        name: "columns-feature",
        instances: [
          "#trends > div.container > div.grid-layout.tablet-1-column.grid-gap-lg"
        ]
      },
      {
        name: "cards-trend",
        instances: [
          "#main-content > section.section.secondary-section > div.container > div.grid-layout.desktop-3-column.tablet-1-column.grid-gap-lg"
        ]
      },
      {
        name: "cards-gallery",
        instances: [
          "#main-content > section.section:nth-of-type(3) > div.container > div.grid-layout.desktop-3-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm"
        ]
      }
    ],
    sections: [
      {
        id: "rc2",
        name: "Hero / page header",
        selector: "#main-content > header.section.secondary-section",
        style: null,
        blocks: ["hero-feature"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "Trend alert feature",
        selector: "#trends",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: [
          "#trends > div.container > div.utility-text-align-center > h2.h2-heading",
          "#trends > div.container > div.utility-text-align-center > p.paragraph-lg"
        ]
      },
      {
        id: "rc4",
        name: "Trends that turn heads",
        selector: "#main-content > section.section.secondary-section",
        style: null,
        blocks: ["cards-trend"],
        defaultContent: [
          "#main-content > section.section.secondary-section > div.container > div.utility-text-align-center > h2.h2-heading"
        ]
      },
      {
        id: "rc5",
        name: "Style in every snapshot",
        selector: "#main-content > section.section:nth-of-type(3)",
        style: null,
        blocks: ["cards-gallery"],
        defaultContent: [
          "#main-content > section.section:nth-of-type(3) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem > h2.h2-heading",
          "#main-content > section.section:nth-of-type(3) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem > p.paragraph-lg"
        ]
      },
      {
        id: "rc6",
        name: "Newsletter CTA",
        selector: "#main-content > section.section.accent-section",
        style: "accent",
        blocks: [],
        defaultContent: [
          "#main-content > section.section.accent-section > div.container"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_fashion_trends_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_fashion_trends_exports);
})();
