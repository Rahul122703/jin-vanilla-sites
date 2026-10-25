(function () {
  const container = document.getElementById("nav-wrapper");
  if (!container || container.dataset.navScrollInit === "true") return;
  container.dataset.navScrollInit = "true";

  const spacer = document.getElementById("nav-bloom-spacer");
  const stickyNavbar = false;
  const topHeader = document.getElementById("nav-top-header");

  const getScrollTop = () =>
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0;

  // Reserve the fixed container's height so content does not slide underneath.
  // Only measure while unscrolled: some variants collapse a top row once
  // scrolled, and letting the spacer shrink with them moves the content below,
  // which scroll anchoring then compensates for - reading as an upward scroll
  // and re-revealing a hidden navbar.
  const syncSpacer = () => {
    if (!spacer || getScrollTop() > 40) return;
    spacer.style.height = container.offsetHeight + "px";
  };

  let lastScrollY = getScrollTop();

  const handleScroll = () => {
    const scrollTop = getScrollTop();
    const isScrolled = scrollTop > 40;

    if (topHeader) {
      topHeader.style.maxHeight = isScrolled ? "0px" : "300px";
      topHeader.style.opacity = isScrolled ? "0" : "1";
    }

    // The window and document listeners both fire for a single scroll, so only
    // judge direction when the offset actually moved - otherwise the second
    // call compares the offset against itself and always reveals the navbar.
    if (!stickyNavbar && scrollTop !== lastScrollY) {
      // Hide while scrolling down, reveal again on any upward scroll.
      container.style.transform =
        scrollTop > lastScrollY && scrollTop > 100
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
  const menuLinks = menu ? menu.querySelectorAll(".mobile-overlay-link") : [];

  if (!menu) return;

  const openMenu = () => {
    menu.classList.remove("opacity-0", "invisible");
    menu.classList.add("opacity-100", "visible");

    if (overlay) {
      overlay.classList.remove("opacity-0", "invisible");
      overlay.classList.add("opacity-100", "visible");
    }

    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menu.classList.add("opacity-0", "invisible");
    menu.classList.remove("opacity-100", "visible");

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
  const menuLinks = menu ? menu.querySelectorAll(".mobile-overlay-link") : [];

  if (!menu) return;

  const openMenu = () => {
    menu.classList.remove("opacity-0", "invisible");
    menu.classList.add("opacity-100", "visible");

    if (overlay) {
      overlay.classList.remove("opacity-0", "invisible");
      overlay.classList.add("opacity-100", "visible");
    }

    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    menu.classList.add("opacity-0", "invisible");
    menu.classList.remove("opacity-100", "visible");

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
  function initAccordion(section) {
    const items = section.querySelectorAll("[data-accordion-item]");

    items.forEach(function (item) {
      const trigger = item.querySelector("[data-accordion-trigger]");
      const content = item.querySelector("[data-accordion-content]");
      if (!trigger || !content) return;

      if (trigger.dataset.faqInitialized === "true") return;
      trigger.dataset.faqInitialized = "true";

      const icon = trigger.querySelector("svg");

      content.classList.add("hidden");
      trigger.setAttribute("aria-expanded", "false");
      if (icon) {
        icon.style.transform = "rotate(-90deg)";
        icon.style.transition = "transform 0.3s ease-out";
      }

      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = trigger.getAttribute("aria-expanded") === "true";

        if (isOpen) {
          content.classList.add("hidden");
          trigger.setAttribute("aria-expanded", "false");
          if (icon) icon.style.transform = "rotate(-90deg)";
        } else {
          content.classList.remove("hidden");
          trigger.setAttribute("aria-expanded", "true");
          if (icon) icon.style.transform = "rotate(0deg)";
        }
      });
    });
  }

  function initAll() {
    var sections = document.querySelectorAll('[data-faq-root="faq-1"]');
    sections.forEach(initAccordion);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
  window.addEventListener("load", initAll);
})();

(function () {
  const initCookieConsent = () => {
    console.log("[Cookie Export] Initializing...");

    const container = document.getElementById("cookie-consent-modal");

    if (!container) {
      console.error("[Cookie Export] Cookie container not found.");
      return;
    }

    const closeBtn = document.getElementById("cookie-consent-modal-close-btn");
    const acceptBtn = document.getElementById(
      "cookie-consent-modal-accept-btn",
    );
    const declineBtn = document.getElementById(
      "cookie-consent-modal-decline-btn",
    );
    const privacyLink = document.getElementById(
      "cookie-consent-modal-privacy-link",
    );
    const policyModal = document.getElementById(
      "cookie-consent-modal-policy-modal",
    );
    const policyClose = document.getElementById(
      "cookie-consent-modal-policy-close",
    );
    const privacyTab = document.getElementById(
      "cookie-consent-modal-privacy-tab",
    );
    const termsTab = document.getElementById("cookie-consent-modal-terms-tab");
    const privacyContent = document.getElementById(
      "cookie-consent-modal-privacy-content",
    );
    const termsContent = document.getElementById(
      "cookie-consent-modal-terms-content",
    );

    console.log("[Cookie Export] Elements:", {
      container,
      closeBtn,
      acceptBtn,
      declineBtn,
      privacyLink,
      policyModal,
      policyClose,
      privacyTab,
      termsTab,
      privacyContent,
      termsContent,
    });

    const handleClose = () => {
      console.log("[Cookie Export] Closing cookie modal.");

      container.style.display = "none";
    };

    const openPolicy = () => {
      console.log("[Cookie Export] Privacy Policy clicked.");

      if (!policyModal) {
        console.error("[Cookie Export] Policy modal not found.");
        return;
      }

      policyModal.classList.remove("hidden");
      policyModal.classList.add("flex");

      console.log(
        "[Cookie Export] Policy modal opened:",
        policyModal.className,
      );
    };

    const closePolicy = () => {
      console.log("[Cookie Export] Closing policy modal.");

      if (!policyModal) {
        console.error("[Cookie Export] Policy modal not found.");
        return;
      }

      policyModal.classList.remove("flex");
      policyModal.classList.add("hidden");
    };

    const showPrivacy = () => {
      console.log("[Cookie Export] Showing Privacy Policy.");

      if (privacyContent) {
        privacyContent.classList.remove("hidden");
        privacyContent.classList.add("block");
      }

      if (termsContent) {
        termsContent.classList.remove("block");
        termsContent.classList.add("hidden");
      }

      if (privacyTab) {
        privacyTab.classList.add("border-zinc-900", "text-zinc-900");

        privacyTab.classList.remove("border-transparent", "text-zinc-500");
      }

      if (termsTab) {
        termsTab.classList.remove("border-zinc-900", "text-zinc-900");

        termsTab.classList.add("border-transparent", "text-zinc-500");
      }
    };

    const showTerms = () => {
      console.log("[Cookie Export] Showing Terms.");

      if (privacyContent) {
        privacyContent.classList.remove("block");
        privacyContent.classList.add("hidden");
      }

      if (termsContent) {
        termsContent.classList.remove("hidden");
        termsContent.classList.add("block");
      }

      if (termsTab) {
        termsTab.classList.add("border-zinc-900", "text-zinc-900");

        termsTab.classList.remove("border-transparent", "text-zinc-500");
      }

      if (privacyTab) {
        privacyTab.classList.remove("border-zinc-900", "text-zinc-900");

        privacyTab.classList.add("border-transparent", "text-zinc-500");
      }
    };

    closeBtn?.addEventListener("click", handleClose);
    acceptBtn?.addEventListener("click", handleClose);
    declineBtn?.addEventListener("click", handleClose);
    privacyLink?.addEventListener("click", openPolicy);
    policyClose?.addEventListener("click", closePolicy);
    privacyTab?.addEventListener("click", showPrivacy);
    termsTab?.addEventListener("click", showTerms);

    console.log("[Cookie Export] Event listeners registered.");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCookieConsent, {
      once: true,
    });
  } else {
    initCookieConsent();
  }
})();
