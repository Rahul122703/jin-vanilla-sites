/**
    headerFixed
    retinaLogos
    video
    btnMobile
    btnWelcome
    tabs
    btnQuantity
    infiniteScroll
    changeValue
    filterTab
    goTop
    preloader
 
**/

(function ($) {
  ("use strict");

  // headerFixed
  var headerFixed = function () {
    if ($("header").hasClass("header-fixed")) {
      var nav = $("#header-main");
      var height = $("#header-main .wrapper");
      var headerInner = $("header .header-inner");
      if (nav.length && height.length) {
        var lastScrollTop = 0;
        var offsetTop = nav.offset().top;
        var headerHeight = height.height();
        var injectSpace = $("<div>", { height: headerHeight }).hide();
        if (!$("header").hasClass("style-absolute")) {
          injectSpace.insertAfter(nav);
        }
        $(window).on("load scroll", function () {
          let navbarHeight = $("header .header-inner").outerHeight();
          var st = $(this).scrollTop();
          if (st > offsetTop) {
            nav.addClass("is-fixed");
            injectSpace.show();
            if (st > lastScrollTop) {
              $("header .header-inner").css("top", `-${navbarHeight}px`); // Ẩn header
            } else {
              $("header .header-inner").css("top", "0px");
            }
          }
          if (st < 170) {
            nav.removeClass("is-fixed");
            injectSpace.hide();
            headerInner.slideDown();
          }

          lastScrollTop = st;
          if (st > headerInner) {
            nav.addClass("is-small");
          } else {
            nav.removeClass("is-small");
          }
        });
      }
    }
  };

  // retinaLogos
  var retinaLogos = function () {
    var retina = window.devicePixelRatio > 1 ? true : false;
    if (retina) {
      var tfheader = $("#logo_header").data("retina");
      $(".header-logo")
        .find("img")
        .attr({ src: tfheader, width: "158px", height: "47px" });

      var tfmobile = $("#mobile-logo_header").data("retina");
      $(".mobile-nav-wrap")
        .find("img")
        .attr({ src: tfmobile, width: "158px", height: "47px" });

      var tffooter = $("#logo_footer").data("retina");
      $(".footer-logo")
        .find("img")
        .attr({ src: tffooter, width: "181px", height: "54px" });
    }
  };

  //btnmobile
  var btnMobile = function () {
    if ($("header").hasClass("header")) {
      $(".nav-button").on("click", function () {
        $(this)
          .closest("#header-main")
          .find(".mobile-nav-wrap")
          .toggleClass("active");

        $(this).toggleClass("active");
      });
      $(".mobile-nav-close").on("click", function () {
        $(this)
          .closest("#header-main")
          .find(".mobile-nav-wrap")
          .toggleClass("active");
      });
      $(".menu-link").on("click", function () {
        $(this)
          .closest("#header-main")
          .find(".mobile-nav-wrap")
          .toggleClass("active");
        $(this)
          .closest("#header-main")
          .find(".nav-button")
          .toggleClass("active");
      });

      $(document).on("click", ".menu-item-has-children-mobile", function () {
        var args = { duration: 300 };
        if ($(this).hasClass("active")) {
          $(this).children(".sub-menu-mobile").slideUp(args);
          $(this).removeClass("active");
        } else {
          $(".sub-menu-mobile").slideUp(args);
          $(this).children(".sub-menu-mobile").slideDown(args);
          $(".menu-item-has-children-mobile").removeClass("active");
          $(this).addClass("active");
        }
      });
    }
  };

  // Video
  var video = function () {
    if ($("div").hasClass("widget-video")) {
      $(".popup-youtube").magnificPopup({
        type: "iframe",
      });
    }
  };

  // btnWelcome
  var btnWelcome = () => {
    const btnOpen = $(".btn-open-welcome");
    const welcomeOpen = $(".wg-welcome");
    const btnCloseWelcome = $(".btn-close-welcome");

    btnOpen.on("click", () => {
      welcomeOpen.toggleClass("active");
    });
    btnCloseWelcome.on("click", (e) => {
      welcomeOpen.removeClass("active");
      e.preventDefault();
    });
  };

  //tabs
  var tabs = function () {
    $(".widget-tabs").each(function () {
      $(this).find(".widget-content-tab").children().hide();
      $(this).find(".widget-content-tab").children(".active").show();
      $(this)
        .find(".widget-menu-tab")
        .children(".item-title")
        .on("click", function () {
          var liActive = $(this).index();
          var contentActive = $(this)
            .siblings()
            .removeClass("active")
            .parents(".widget-tabs")
            .find(".widget-content-tab")
            .children()
            .eq(liActive);
          contentActive.addClass("active").fadeIn("slow");
          contentActive.siblings().removeClass("active");
          $(this)
            .addClass("active")
            .parents(".widget-tabs")
            .find(".widget-content-tab")
            .children()
            .eq(liActive)
            .siblings()
            .hide();
        });
    });
  };

  //btnQuantity
  var btnQuantity = function () {
    $(".minus-btn").on("click", function (e) {
      e.preventDefault();
      var $this = $(this);
      var $input = $this.closest("div").find("input");
      var value = parseInt($input.val());

      if (value > 1) {
        value = value - 1;
      }

      $input.val(value);
    });

    $(".plus-btn").on("click", function (e) {
      e.preventDefault();
      var $this = $(this);
      var $input = $this.closest("div").find("input");
      var value = parseInt($input.val());

      if (value > 0) {
        value = value + 1;
      }

      $input.val(value);
    });
  };

  //infiniteScroll
  var infiniteScroll = function () {
    $(".fl-item").slice(0, 6).show();
    $(".fl-item1").slice(0, 6).show();
    $(".fl-item2").slice(0, 6).show();
    $(".fl-item3").slice(0, 6).show();
    $(".fl-item4").slice(0, 6).show();
    $(".fl-item5").slice(0, 6).show();
    $(".fl-item6").slice(0, 6).show();

    if ($(".showmore-item").length > 0) {
      $(".btn-showmore").on("click", function () {
        setTimeout(() => {
          $(".fl-item:hidden").slice(0, 3).show();
          if ($(".fl-item:hidden").length == 0) {
            $(".view-more-button").hide();
          }
        }, 600);
      });
    }

    if ($(".showmore-item1").length > 0) {
      $(".btn-showmore1").on("click", function () {
        setTimeout(() => {
          $(".fl-item1:hidden").slice(0, 3).show();
          if ($(".fl-item1:hidden").length == 0) {
            $(".view-more-button1").hide();
          }
        }, 600);
      });
    }

    if ($(".showmore-item2").length > 0) {
      $(".btn-showmore2").on("click", function () {
        setTimeout(() => {
          $(".fl-item2:hidden").slice(0, 3).show();
          if ($(".fl-item2:hidden").length == 0) {
            $(".view-more-button2").hide();
          }
        }, 600);
      });
    }

    if ($(".showmore-item3").length > 0) {
      $(".btn-showmore3").on("click", function () {
        setTimeout(() => {
          $(".fl-item3:hidden").slice(0, 3).show();
          if ($(".fl-item3:hidden").length == 0) {
            $(".view-more-button3").hide();
          }
        }, 600);
      });
    }

    if ($(".showmore-item4").length > 0) {
      $(".btn-showmore4").on("click", function () {
        setTimeout(() => {
          $(".fl-item4:hidden").slice(0, 3).show();
          if ($(".fl-item4:hidden").length == 0) {
            $(".view-more-button4").hide();
          }
        }, 600);
      });
    }
    if ($(".showmore-item5").length > 0) {
      $(".btn-showmore5").on("click", function () {
        setTimeout(() => {
          $(".fl-item5:hidden").slice(0, 3).show();
          if ($(".fl-item5:hidden").length == 0) {
            $(".view-more-button5").hide();
          }
        }, 600);
      });
    }
    if ($(".showmore-item6").length > 0) {
      $(".btn-showmore6").on("click", function () {
        setTimeout(() => {
          $(".fl-item6:hidden").slice(0, 3).show();
          if ($(".fl-item6:hidden").length == 0) {
            $(".view-more-button6").hide();
          }
        }, 600);
      });
    }
  };

  //changeValue
  var changeValue = function () {
    if ($(".tf-dropdown-sort").length > 0) {
      $(".select-item").click(function (event) {
        $(this)
          .closest(".tf-dropdown-sort")
          .find(".text-sort-value")
          .text($(this).find(".text-value-item").text());

        $(this)
          .closest(".dropdown-menu")
          .find(".select-item.active")
          .removeClass("active");

        $(this).addClass("active");
      });
    }
  };

  // filterTab
  var filterTab = function () {
    var $btnFilter = $(".tf-btns-filter").click(function () {
      if (this.id == "*") {
        $("#parent > div").show();
      } else {
        var $el = $("." + this.id).show();
        $("#parent > div").not($el).hide();
      }
      $btnFilter.removeClass("is--active");
      $(this).addClass("is--active");
    });
  };
  //goTop
  var goTop = function () {
    if ($("div").hasClass("progress-wrap")) {
      var progressPath = document.querySelector(".progress-wrap path");
      var pathLength = progressPath.getTotalLength();
      progressPath.style.transition = progressPath.style.WebkitTransition =
        "none";
      progressPath.style.strokeDasharray = pathLength + " " + pathLength;
      progressPath.style.strokeDashoffset = pathLength;
      progressPath.getBoundingClientRect();
      progressPath.style.transition = progressPath.style.WebkitTransition =
        "stroke-dashoffset 10ms linear";
      var updateprogress = function () {
        var scroll = $(window).scrollTop();
        var height = $(document).height() - $(window).height();
        var progress = pathLength - (scroll * pathLength) / height;
        progressPath.style.strokeDashoffset = progress;
      };
      updateprogress();
      $(window).scroll(updateprogress);
      var offset = 200;
      var duration = 200;
      jQuery(window).on("scroll", function () {
        if (jQuery(this).scrollTop() > offset) {
          jQuery(".progress-wrap").addClass("active-progress");
        } else {
          jQuery(".progress-wrap").removeClass("active-progress");
        }
      });
      jQuery(".progress-wrap").on("click", function (event) {
        event.preventDefault();
        jQuery("html, body").animate({ scrollTop: 0 }, duration);
        return false;
      });
    }
  };

  // preloader
  var preloader = function () {
    $("#load").fadeOut();
    $("#loading").delay(700).fadeOut("slow");
  };

  // Dom Ready
  $(function () {
    headerFixed();
    retinaLogos();
    video();
    btnMobile();
    btnWelcome();
    tabs();
    btnQuantity();
    infiniteScroll();
    changeValue();
    filterTab();
    goTop();
    preloader();
  });
})(jQuery);
