// Small progressive enhancements. The site works fine without this file.

(function () {
  "use strict";

  // 1. Only one nav dropdown open at a time, and close on outside click / Escape.
  var dropdowns = Array.prototype.slice.call(
    document.querySelectorAll(".dropdown")
  );

  dropdowns.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      dropdowns.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  document.addEventListener("click", function (event) {
    dropdowns.forEach(function (item) {
      if (item.open && !item.contains(event.target)) item.open = false;
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    dropdowns.forEach(function (item) {
      item.open = false;
    });
  });

  // 2. Live search filter on pages that include a search box.
  var search = document.querySelector("[data-search]");
  if (!search) return;

  var cards = Array.prototype.slice.call(
    document.querySelectorAll("[data-search-item]")
  );
  var emptyState = document.querySelector("[data-search-empty]");

  search.addEventListener("input", function () {
    var query = search.value.trim().toLowerCase();
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = (card.getAttribute("data-search-item") || "").toLowerCase();
      var match = query === "" || haystack.indexOf(query) !== -1;
      card.classList.toggle("is-hidden", !match);
      if (match) visible++;
    });

    if (emptyState) emptyState.classList.toggle("is-hidden", visible !== 0);
  });
})();
