"use strict";

(function ($) {
  $(function () {
    // PRELOADER
    if (sessionStorage.getItem("isFirstRun")) {
      $("#preloader").addClass("d-none");
    }

    $(window).on("load", function (e) {
      $("#preloader").fadeOut();
      this.sessionStorage.setItem("isFirstRun", true);
    });
    setTimeout(function () {
      $("#preloader").fadeOut();
      this.sessionStorage.setItem("isFirstRun", true);
    }, 4000);
  });
})(jQuery);
"use strict";

(function ($) {
  var js_scroll_to_top = function js_scroll_to_top() {
    var $selector = $(".page-to-top");

    if ($selector.length < 1) {
      return;
    }

    var doc_height = $(document).height();
    $(window).on("scroll", function () {
      var offset_top = $(window).scrollTop();
      offset_top > doc_height / 2 ? $selector.addClass("fixed") : $selector.removeClass("fixed");
    });
    $selector.on("click", function (e) {
      e.preventDefault();
      $("html,body").animate({
        scrollTop: 0
      }, 800);
    });
  };

  $(function () {
    js_scroll_to_top(); // PRELOADER

    if (sessionStorage.getItem("isFirstRun")) {
      $("#preloader").addClass("d-none");
    }

    $(window).on("load", function (e) {
      $("#preloader").fadeOut();
      this.sessionStorage.setItem("isFirstRun", true);
    });
    setTimeout(function () {
      $("#preloader").fadeOut();
      this.sessionStorage.setItem("isFirstRun", true);
    }, 4000);
  });
})(jQuery);
"use strict";

(function ($) {
  var js_checkboxes = function js_checkboxes() {
    $("[data-checkboxes]").each(function () {
      var me = $(this),
          group = me.data('checkboxes'),
          role = me.data('checkbox-role');
      me.change(function () {
        var all = $('[data-checkboxes="' + group + '"]:not([data-checkbox-role="dad"])'),
            checked = $('[data-checkboxes="' + group + '"]:not([data-checkbox-role="dad"]):checked'),
            dad = $('[data-checkboxes="' + group + '"][data-checkbox-role="dad"]'),
            total = all.length,
            checked_length = checked.length;

        if (role === 'dad') {
          me.is(':checked') ? all.prop('checked', true) : all.prop('checked', false);
        } else {
          checked_length >= total ? dad.prop('checked', true) : dad.prop('checked', false);
        }
      });
    });
  };

  $(function () {
    js_checkboxes();
  });
})(jQuery);