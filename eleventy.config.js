// Eleventy configuration.
// You should not need to edit this file to add reviews or new categories —
// categories and subcategories are discovered automatically from your reviews.

const CATEGORY_ORDER = ["Skincare", "Makeup", "Bodycare"];

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// All published reviews, newest first.
function publishedReviews(collectionApi) {
  return collectionApi
    .getFilteredByTag("review")
    .filter((item) => item.data.draft !== true)
    .sort((a, b) => b.date - a.date);
}

// Builds the category tree: [{ name, slug, count, subs: [{ name, slug, count }] }]
function buildTree(collectionApi) {
  const groups = new Map();

  for (const item of publishedReviews(collectionApi)) {
    const category = item.data.category;
    if (!category) continue;

    if (!groups.has(category)) {
      groups.set(category, {
        name: category,
        slug: toSlug(category),
        count: 0,
        subs: new Map(),
      });
    }
    const group = groups.get(category);
    group.count += 1;

    const sub = item.data.subcategory;
    if (sub) {
      if (!group.subs.has(sub)) {
        group.subs.set(sub, { name: sub, slug: toSlug(sub), count: 0 });
      }
      group.subs.get(sub).count += 1;
    }
  }

  return [...groups.values()]
    .map((group) => ({
      name: group.name,
      slug: group.slug,
      count: group.count,
      subs: [...group.subs.values()].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    }))
    .sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a.name);
      const bi = CATEGORY_ORDER.indexOf(b.name);
      return (
        (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) ||
        a.name.localeCompare(b.name)
      );
    });
}

module.exports = function (eleventyConfig) {
  // --- Static files copied straight through to the built site ---
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/uploads");

  // The admin folder is plain static files (.html / .yml), and neither of those
  // is in templateFormats below, so it is copied across untouched.
  eleventyConfig.addPassthroughCopy("src/admin");

  // --- Collections ---
  eleventyConfig.addCollection("reviews", publishedReviews);

  eleventyConfig.addCollection("categoryList", buildTree);

  eleventyConfig.addCollection("subcategoryList", (collectionApi) => {
    const flat = [];
    for (const category of buildTree(collectionApi)) {
      for (const sub of category.subs) {
        flat.push({
          category: category.name,
          categorySlug: category.slug,
          name: sub.name,
          slug: sub.slug,
          count: sub.count,
        });
      }
    }
    return flat;
  });

  // --- Filters ---
  eleventyConfig.addFilter("toSlug", toSlug);

  eleventyConfig.addFilter("readableDate", (value) => {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date)) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  eleventyConfig.addFilter("isoDate", (value) => {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date)) return "";
    return date.toISOString().slice(0, 10);
  });

  // Filter a list of reviews by a front matter field, e.g. | whereData("category", "Skincare")
  eleventyConfig.addFilter("whereData", (items, key, value) =>
    (items || []).filter((item) => item.data[key] === value)
  );

  eleventyConfig.addFilter("limit", (items, count) =>
    (items || []).slice(0, count)
  );

  // Drop the current page out of a "related reviews" list.
  eleventyConfig.addFilter("excludeUrl", (items, url) =>
    (items || []).filter((item) => item.url !== url)
  );

  // Percentage width used to paint the star rating.
  eleventyConfig.addFilter("starPercent", (rating) => {
    const number = Number(rating);
    if (!number || isNaN(number)) return 0;
    return Math.max(0, Math.min(100, Math.round((number / 5) * 100)));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    // Markdown files are NOT run through Nunjucks. This means you can safely
    // type curly braces in a review without breaking the build.
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk"],
  };
};
