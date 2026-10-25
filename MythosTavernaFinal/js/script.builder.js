(function () {
  const container = document.getElementById("nav-wrapper");
  if (!container || container.dataset.navScrollInit === "true") return;
  container.dataset.navScrollInit = "true";

  const spacer = document.getElementById("nav-bloom-spacer");
  const collapsible = document.getElementById("nav-top-header");
  const stickyNavbar = false;

  const getScrollTop = () =>
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;

  // Reserve the fixed container's full height so content does not slide
  // underneath. See getExpandedHeight: a folded row is added back, so this is
  // right at any scroll offset and never shrinks as the row folds.
  const syncSpacer = () => {
    if (!spacer) return;
    const folded = collapsible
      ? collapsible.scrollHeight - collapsible.clientHeight
      : 0;
    spacer.style.height = container.offsetHeight + folded + "px";
  };

  let lastScrollY = getScrollTop();

  const handleScroll = () => {
    const scrollTop = getScrollTop();
    const isScrolled = scrollTop > 40;
    // See getCollapseOffset: fold the row only once the page has scrolled
    // its height, so the bar never ends up shorter than the visible spacer.
    const isCollapsed =
      !!collapsible && scrollTop >= Math.max(40, collapsible.scrollHeight);

    if (collapsible) {
      collapsible.style.maxHeight = isCollapsed ? "0px" : "300px";
      collapsible.style.opacity = isCollapsed ? "0" : "1";
    }

    // The window and document listeners both fire for a single scroll, so only
    // judge direction when the offset actually moved - otherwise the second
    // call compares the offset against itself and always reveals the navbar.
    if (!stickyNavbar && scrollTop !== lastScrollY) {
      // Hide while scrolling down, reveal again on any upward scroll.
      container.style.transform =
        scrollTop > lastScrollY &&
        // See getHideOffset: not while part of the spacer is still showing.
        scrollTop > Math.max(100, spacer ? spacer.offsetHeight : 0)
          ? "translateY(-100%)"
          : "none";
    }

    lastScrollY = scrollTop;
  };

  syncSpacer();
  handleScroll();

  window.addEventListener("scroll", handleScroll, { passive: true });
  document.addEventListener("scroll", handleScroll, {
    passive: true,
    capture: true,
  });
  window.addEventListener("resize", syncSpacer);

  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(syncSpacer).observe(container);
  }
})();

(function () {
  const notifBar = document.getElementById("nav-notification-bar");
  const notifCloseBtn = document.getElementById("nav-close-notification");

  if (notifCloseBtn && notifBar) {
    notifCloseBtn.addEventListener("click", () => {
      notifBar.style.display = "none";
    });
  }
})();

(function () {
  const menu = document.getElementById("nav-desktop-menu");
  const overlay = document.getElementById("nav-desktop-overlay");
  const openBtn = document.getElementById("nav-desktop-open-btn");
  const closeBtn = document.getElementById("nav-desktop-close-btn");
  const menuLinks = menu ? menu.querySelectorAll(".mobile-menu-link") : [];

  if (!menu) return;

  const openMenu = () => {
    menu.classList.remove("translate-x-full", "invisible");
    menu.classList.add("translate-x-0", "visible");

    if (overlay) {
      overlay.classList.remove("opacity-0", "invisible");
      overlay.classList.add("opacity-100", "visible");
    }

    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menu.classList.add("translate-x-full", "invisible");
    menu.classList.remove("translate-x-0", "visible");

    if (overlay) {
      overlay.classList.add("opacity-0", "invisible");
      overlay.classList.remove("opacity-100", "visible");
    }

    document.body.style.overflow = "";
  };

  if (openBtn) openBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);
  menuLinks.forEach((link) => link.addEventListener("click", closeMenu));
})();

(function () {
  const menu = document.getElementById("nav-mobile-menu");
  const overlay = document.getElementById("nav-mobile-overlay");
  const openBtn = document.getElementById("nav-mobile-open-btn");
  const closeBtn = document.getElementById("nav-mobile-close-btn");
  const menuLinks = menu ? menu.querySelectorAll(".mobile-menu-link") : [];

  if (!menu) return;

  const openMenu = () => {
    menu.classList.remove("translate-x-full", "invisible");
    menu.classList.add("translate-x-0", "visible");

    if (overlay) {
      overlay.classList.remove("opacity-0", "invisible");
      overlay.classList.add("opacity-100", "visible");
    }

    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menu.classList.add("translate-x-full", "invisible");
    menu.classList.remove("translate-x-0", "visible");

    if (overlay) {
      overlay.classList.add("opacity-0", "invisible");
      overlay.classList.remove("opacity-100", "visible");
    }

    document.body.style.overflow = "";
  };

  if (openBtn) openBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);
  menuLinks.forEach((link) => link.addEventListener("click", closeMenu));
})();

(function () {
  function initTestimonialCarousel() {
    const sections = document.querySelectorAll("._testimonial3_section");

    sections.forEach((section) => {
      const container = section.querySelector(".carousel-container");
      const prevBtn = section.querySelector(".carousel-prev");
      const nextBtn = section.querySelector(".carousel-next");
      const dots = section.querySelectorAll(".carousel-dot");

      if (!container || container.dataset.init) return;
      container.dataset.init = "true";

      const getSlideWidth = () => {
        const slide = container.firstElementChild;
        if (!slide) return 0;
        return slide.offsetWidth;
      };

      if (prevBtn) {
        prevBtn.addEventListener("click", () => {
          container.scrollBy({ left: -getSlideWidth(), behavior: "smooth" });
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", () => {
          container.scrollBy({ left: getSlideWidth(), behavior: "smooth" });
        });
      }

      if (dots.length > 0) {
        container.addEventListener(
          "scroll",
          () => {
            const slideWidth = getSlideWidth();
            if (slideWidth === 0) return;
            const index = Math.round(container.scrollLeft / slideWidth);

            dots.forEach((dot, i) => {
              dot.setAttribute("data-active", i === index ? "true" : "false");
              dot.setAttribute("aria-current", i === index ? "true" : "false");
            });
          },
          { passive: true },
        );

        dots.forEach((dot, i) => {
          dot.addEventListener("click", () => {
            container.scrollTo({
              left: i * getSlideWidth(),
              behavior: "smooth",
            });
          });
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTestimonialCarousel);
  } else {
    initTestimonialCarousel();
  }
  window.addEventListener("load", initTestimonialCarousel);
})();

(function () {
  document.querySelectorAll("[data-menu2-root]").forEach(function (root) {
    if (root.dataset.menu2Ready === "true") return;
    root.dataset.menu2Ready = "true";

    var tabs = root.querySelectorAll("[data-menu2-tab]");
    var panels = root.querySelectorAll("[data-menu2-panel]");

    function select(index) {
      tabs.forEach(function (tab) {
        var on = tab.dataset.menu2Tab === index;
        tab.setAttribute("data-active", on ? "true" : "false");
        tab.setAttribute("aria-pressed", on ? "true" : "false");
      });

      panels.forEach(function (panel) {
        panel.classList.toggle("hidden", panel.dataset.menu2Panel !== index);
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        select(tab.dataset.menu2Tab);
      });

      tab.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select(tab.dataset.menu2Tab);
        }
      });
    });
  });
})();

// Gallery5: below lg the CSS hides the vertical columns and shows two
// horizontal marquee rows built here from the same photos. Clones keep
// data-lightbox-index, so the lightbox opens them like the originals.
(function () {
  document.querySelectorAll("[data-gallery5-root]").forEach(function (root) {
    var seen = {};
    var tiles = [];
    root.querySelectorAll("[data-lightbox-index]").forEach(function (tile) {
      var index = tile.getAttribute("data-lightbox-index");
      if (seen[index]) return;
      seen[index] = true;
      tiles.push(tile);
    });
    if (!tiles.length) return;

    tiles.sort(function (a, b) {
      return a.dataset.lightboxIndex - b.dataset.lightboxIndex;
    });

    function cloneTile(tile, hidden) {
      var copy = tile.cloneNode(true);
      // Motion runtime may have left an entrance state inline; clones skip it.
      [copy].concat(Array.from(copy.querySelectorAll("[data-motion-config]")))
        .forEach(function (node) {
          if (!node.hasAttribute("data-motion-config")) return;
          node.removeAttribute("data-motion");
          node.removeAttribute("data-motion-config");
          node.style.opacity = "";
          node.style.transform = "";
        });
      if (hidden) copy.setAttribute("tabindex", "-1");
      return copy;
    }

    function buildRow(list, direction) {
      var row = document.createElement("div");
      var track = document.createElement("div");
      track.className = "gallery5-track gallery5-marquee-" + direction;
      [false, true].forEach(function (hidden) {
        var set = document.createElement("div");
        set.className = "gallery5-set";
        if (hidden) set.setAttribute("aria-hidden", "true");
        list.forEach(function (tile) {
          set.appendChild(cloneTile(tile, hidden));
        });
        track.appendChild(set);
      });
      row.appendChild(track);
      return row;
    }

    var half = Math.ceil(tiles.length / 2);
    var rows = document.createElement("div");
    rows.className = "gallery5-rows";
    rows.appendChild(buildRow(tiles.slice(0, half), "right"));
    rows.appendChild(buildRow(tiles.slice(half), "left"));
    root.appendChild(rows);
  });
})();

(function () {
  if (window.__fgrGalleryLightbox) return;
  window.__fgrGalleryLightbox = true;

  var ITEM = "data-lightbox-index";
  var CAPTION = "data-lightbox-caption";
  var ROOT = "data-gallery-lightbox";
  var ICONS = {
    close: "M18 6 6 18M6 6l12 12",
    prev: "M15 19l-7-7 7-7",
    next: "M9 5l7 7-7 7",
  };
  var modal,
    backdrop,
    counter,
    closeBtn,
    prevBtn,
    nextBtn,
    stage,
    img,
    caption,
    thumbs;
  var items = [];
  var current = 0;
  var opts = null;
  var trigger = null;
  var previousOverflow = "";
  var touchStart = null;

  function make(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function button(className, label, icon) {
    var node = make("button", "fgr-lb__btn " + className);
    node.type = "button";
    node.setAttribute("aria-label", label);
    node.innerHTML =
      '<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="' +
      icon +
      '"/></svg>';
    return node;
  }

  function build() {
    modal = make("div", "fgr-lb");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Photo viewer");
    modal.hidden = true;

    backdrop = make("div", "fgr-lb__backdrop");
    counter = make("div", "fgr-lb__counter");
    counter.setAttribute("aria-live", "polite");
    closeBtn = button("fgr-lb__close", "Close", ICONS.close);
    prevBtn = button("fgr-lb__prev", "Previous photo", ICONS.prev);
    nextBtn = button("fgr-lb__next", "Next photo", ICONS.next);
    stage = make("div", "fgr-lb__stage");
    img = make("img", "fgr-lb__img");
    img.draggable = false;
    caption = make("p", "fgr-lb__caption");
    thumbs = make("div", "fgr-lb__thumbs");

    stage.appendChild(img);
    [
      backdrop,
      counter,
      closeBtn,
      prevBtn,
      nextBtn,
      stage,
      caption,
      thumbs,
    ].forEach(function (node) {
      modal.appendChild(node);
    });
    document.body.appendChild(modal);

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () {
      go(current - 1);
    });
    nextBtn.addEventListener("click", function () {
      go(current + 1);
    });

    [backdrop, stage].forEach(function (node) {
      node.addEventListener("click", function (event) {
        if (opts && opts.backdropClose && event.target === node) close();
      });
    });

    modal.addEventListener(
      "touchstart",
      function (event) {
        var touch = event.touches[0];
        touchStart = touch ? { x: touch.clientX, y: touch.clientY } : null;
      },
      { passive: true },
    );

    modal.addEventListener(
      "touchend",
      function (event) {
        var touch = event.changedTouches[0];
        var start = touchStart;
        touchStart = null;
        if (!start || !touch) return;
        var dx = touch.clientX - start.x;
        var dy = touch.clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
          if (dx < 0 && canNext()) go(current + 1);
          if (dx > 0 && canPrev()) go(current - 1);
        }
      },
      { passive: true },
    );
  }

  function collect(root) {
    var byIndex = {};
    var list = [];
    Array.prototype.forEach.call(
      root.querySelectorAll("[" + ITEM + "]"),
      function (node) {
        var index = Number(node.getAttribute(ITEM));
        if (!isFinite(index) || byIndex[index]) return;
        var image = node.tagName === "IMG" ? node : node.querySelector("img");
        var src = image && (image.currentSrc || image.getAttribute("src"));
        if (!src) return;
        byIndex[index] = true;
        list.push({
          index: index,
          src: src,
          alt: image.alt || "",
          caption: node.getAttribute(CAPTION) || image.alt || "",
        });
      },
    );
    return list.sort(function (a, b) {
      return a.index - b.index;
    });
  }

  function canPrev() {
    return items.length > 1 && (opts.loop || current > 0);
  }
  function canNext() {
    return items.length > 1 && (opts.loop || current < items.length - 1);
  }

  function go(index) {
    var count = items.length;
    if (!count) return;
    current = opts.loop
      ? ((index % count) + count) % count
      : Math.min(count - 1, Math.max(0, index));
    render();
  }

  function render() {
    var item = items[current];
    var many = items.length > 1;

    img.src = item.src;
    img.alt = item.alt;

    caption.textContent = item.caption;
    caption.title = item.caption;
    // Kept, empty, for a photo with no caption, as in the React popup.
    caption.hidden = !opts.captions;

    counter.textContent = current + 1 + " / " + items.length;
    counter.hidden = !opts.counter || !many;

    prevBtn.hidden = !canPrev();
    nextBtn.hidden = !canNext();

    Array.prototype.forEach.call(thumbs.children, function (thumb, i) {
      if (i === current) thumb.setAttribute("aria-current", "true");
      else thumb.removeAttribute("aria-current");
    });
  }

  function open(root, item) {
    var list = collect(root);
    var wanted = Number(item.getAttribute(ITEM));
    var position = -1;

    list.forEach(function (entry, i) {
      if (entry.index === wanted) position = i;
    });

    if (position < 0) return false;
    if (!modal) build();

    var data = root.dataset;
    opts = {
      captions: data.lbCaptions !== "false",
      counter: data.lbCounter !== "false",
      thumbs: data.lbThumbs !== "false",
      loop: data.lbLoop !== "false",
      backdropClose: data.lbBackdropClose !== "false",
    };

    items = list;
    current = position;
    trigger = item;

    backdrop.style.backgroundColor = data.lbBackdropColor || "#000000";
    backdrop.style.opacity = String(
      (Number(data.lbBackdropOpacity) || 0) / 100,
    );

    var showThumbs = opts.thumbs && items.length > 1;
    thumbs.innerHTML = "";
    thumbs.hidden = !showThumbs;

    if (showThumbs) {
      items.forEach(function (entry, i) {
        var thumb = make("button", "fgr-lb__thumb");
        var picture = make("img");
        thumb.type = "button";
        thumb.setAttribute("aria-label", "Show photo " + (i + 1));
        picture.src = entry.src;
        picture.alt = "";
        picture.draggable = false;
        thumb.appendChild(picture);
        thumb.addEventListener("click", function () {
          go(i);
        });
        thumbs.appendChild(thumb);
      });
    }

    render();

    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    modal.hidden = false;
    closeBtn.focus();
    return true;
  }

  function close() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.documentElement.style.overflow = previousOverflow;
    if (trigger && trigger.focus) trigger.focus();
  }

  function itemFrom(target) {
    var item =
      target && target.closest ? target.closest("[" + ITEM + "]") : null;
    var root = item && item.closest("[" + ROOT + "]");
    return root && root.getAttribute(ROOT) === "on"
      ? { item: item, root: root }
      : null;
  }

  document.addEventListener("click", function (event) {
    var found = itemFrom(event.target);
    if (found && open(found.root, found.item)) event.preventDefault();
  });

  document.addEventListener("keydown", function (event) {
    if (modal && !modal.hidden) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (canPrev()) go(current - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        if (canNext()) go(current + 1);
      } else if (event.key === "Tab") {
        var focusable = Array.prototype.filter.call(
          modal.querySelectorAll("button"),
          function (node) {
            return (
              !node.hidden && !(node.parentElement && node.parentElement.hidden)
            );
          },
        );
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (!first) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") return;
    var found = itemFrom(event.target);
    // Only the photo itself, as in the React popup.
    if (found && found.item === event.target && open(found.root, found.item)) {
      event.preventDefault();
    }
  });
})();

/*
 * Cookie banner. The visitor's answer is kept in localStorage as JSON
 * `{ choice, savedAt }` and asked again after a year:
 *
 * - The banner is in the page hidden; it is shown only to a visitor with no
 *   saved answer who has not closed it this session.
 * - "Accept" / "Reject" save the answer and tell the page (CONSENT_EVENT),
 *   so non-essential scripts can start after an accept.
 * - The X and the backdrop close it for this session without an answer
 *   (sessionStorage), so non-essential scripts stay off.
 * - The banner's policy link, and any link marked data-legal-link (a
 *   footer's "Privacy Policy"), open the policy popup on that document.
 */
(function () {
  var STORAGE_KEY = "fgr-cookie-consent";
  var DISMISSED_KEY = "fgr-cookie-consent-dismissed";
  var CONSENT_EVENT = "fgr:cookie-consent";
  var MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

  function readCookieConsent() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var record = JSON.parse(raw) || {};
      if (record.choice !== "accepted" && record.choice !== "rejected") return null;
      if (typeof record.savedAt !== "number" || Date.now() - record.savedAt > MAX_AGE_MS) return null;
      return record.choice;
    } catch (error) {
      return null;
    }
  }

  function cookieBannerDismissed() {
    try {
      return window.sessionStorage.getItem(DISMISSED_KEY) === "1";
    } catch (error) {
      return false;
    }
  }

  var init = function () {
    var banner = document.getElementById("cookie-consent-modal");
    var overlay = document.getElementById("cookie-consent-modal-overlay");
    var closeBtn = document.getElementById("cookie-consent-modal-close-btn");
    var acceptBtn = document.getElementById("cookie-consent-modal-accept-btn");
    var declineBtn = document.getElementById("cookie-consent-modal-decline-btn");
    var privacyLink = document.getElementById("cookie-consent-modal-privacy-link");
    var policyModal = document.getElementById("cookie-consent-modal-policy-modal");
    var policyClose = document.getElementById("cookie-consent-modal-policy-close");
    var privacyTab = document.getElementById("cookie-consent-modal-privacy-tab");
    var termsTab = document.getElementById("cookie-consent-modal-terms-tab");
    var privacyContent = document.getElementById("cookie-consent-modal-privacy-content");
    var termsContent = document.getElementById("cookie-consent-modal-terms-content");

    var hideBanner = function () {
      if (banner) banner.style.display = "none";
    };

    var answer = function (choice) {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ choice: choice, savedAt: Date.now() })
        );
      } catch (error) {
        // Storage blocked: the answer still holds for this page.
      }
      try {
        window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }));
      } catch (error) {
        // Very old browser without CustomEvent: nothing listens anyway.
      }
      hideBanner();
    };

    var dismiss = function () {
      try {
        window.sessionStorage.setItem(DISMISSED_KEY, "1");
      } catch (error) {
        // Blocked: the banner comes back on the next page.
      }
      hideBanner();
    };

    var isPolicyOpen = function () {
      return Boolean(policyModal && policyModal.classList.contains("flex"));
    };

    var openPolicy = function () {
      if (!policyModal) return;
      policyModal.classList.remove("hidden");
      policyModal.classList.add("flex");
    };

    var closePolicy = function () {
      if (!policyModal) return;
      policyModal.classList.remove("flex");
      policyModal.classList.add("hidden");
    };

    var selectTab = function (shown, hidden, shownTab, hiddenTab) {
      if (shown) { shown.classList.remove("hidden"); shown.classList.add("block"); }
      if (hidden) { hidden.classList.remove("block"); hidden.classList.add("hidden"); }
      if (shownTab) {
        shownTab.classList.add("border-zinc-900", "text-zinc-900");
        shownTab.classList.remove("border-transparent", "text-zinc-500");
      }
      if (hiddenTab) {
        hiddenTab.classList.remove("border-zinc-900", "text-zinc-900");
        hiddenTab.classList.add("border-transparent", "text-zinc-500");
      }
    };

    var showPrivacy = function () {
      selectTab(privacyContent, termsContent, privacyTab, termsTab);
    };

    var showTerms = function () {
      selectTab(termsContent, privacyContent, termsTab, privacyTab);
    };

    // Ask only a visitor who has neither answered nor closed it this session.
    if (banner && readCookieConsent() === null && !cookieBannerDismissed()) {
      banner.style.display = "";
    }

    if (acceptBtn) acceptBtn.addEventListener("click", function () { answer("accepted"); });
    if (declineBtn) declineBtn.addEventListener("click", function () { answer("rejected"); });
    if (closeBtn) closeBtn.addEventListener("click", dismiss);
    if (overlay) {
      overlay.addEventListener("click", function () {
        if (isPolicyOpen()) closePolicy();
        else dismiss();
      });
    }
    if (privacyLink) {
      privacyLink.addEventListener("click", function () {
        showPrivacy();
        openPolicy();
      });
    }
    if (policyClose) policyClose.addEventListener("click", closePolicy);
    if (privacyTab) privacyTab.addEventListener("click", showPrivacy);
    if (termsTab) termsTab.addEventListener("click", showTerms);

    // A footer's "Terms of Use" / "Privacy Policy" (any link with
    // data-legal-link) opens the popup on that document, banner or not.
    document.addEventListener("click", function (event) {
      var target = event.target;
      var link = target && typeof target.closest === "function"
        ? target.closest("[data-legal-link]")
        : null;

      if (!link) return;

      event.preventDefault();

      if (link.getAttribute("data-legal-link") === "terms") showTerms();
      else showPrivacy();

      openPolicy();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

(function () {
  var button = document.getElementById(
    "scroll-top-b80684af-c70b-4261-824c-49d20cbbd30a",
  );
  if (!button) return;
  var showAfter = 300;
  var smooth = true;
  var hiddenTransform = "translateY(16px)";
  var scrolledBy = function () {
    var top = window.scrollY || 0;
    for (var node = button.parentElement; node; node = node.parentElement) {
      top = Math.max(top, node.scrollTop);
    }
    return top;
  };
  var update = function () {
    var visible = scrolledBy() > showAfter;
    button.style.opacity = visible ? "1" : "0";
    button.style.visibility = visible ? "visible" : "hidden";
    button.style.transform = visible ? "none" : hiddenTransform;
    button.style.pointerEvents = visible ? "auto" : "none";
  };
  document.addEventListener("scroll", update, { capture: true, passive: true });
  update();
  button.addEventListener("click", function () {
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var behavior = smooth && !reduce ? "smooth" : "auto";
    for (var node = button.parentElement; node; node = node.parentElement) {
      if (node.scrollTop > 0) node.scrollTo({ top: 0, behavior: behavior });
    }
    window.scrollTo({ top: 0, behavior: behavior });
  });
})();
