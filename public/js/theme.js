"use strict";
var dark = "inverted",
    localStore = window.localStorage,
    isDark = localStore.getItem("hugo-theme-dream-is-dark");
isDark = isDark || (window.defaultDark ? "y" : isDark);
var dark404 = function () {
    if ((window.backgroundDark || window.backgroundImageDark) && $(".dream-404-container").length) {
        $(".dream-404-container h1").toggleClass(dark);
        var e = $(".dream-404-container button");
        e.toggleClass(dark), e.toggleClass("secondary")
    }
},
    darkBackground = function () {
        (window.backgroundDark || window.backgroundImageDark) && $("body").toggleClass("default").toggleClass("dark")
    },
    darkNavMenu = function () {
        (window.backgroundDark || window.backgroundImageDark) && $("nav.dream-menu").toggleClass(dark)
    },
    darkHeaderElements = function () {
        if ($(".dream-header").length) {
            var e = $(".dream-header .ui.header"),
                a = $(".dream-header .ui.list");
            e.toggleClass(dark), a.toggleClass(dark)
        }
    },
    darkCards = function () {
        var e = $(".dream-card");
        e.length && e.toggleClass(dark)
    },
    darkSingle = function () {
        var e = $(".dream-single .ui.segment");
        e.length && (e.toggleClass(dark), $(".dream-single h1.ui.header").toggleClass(dark), setThemeForUtterances(), "function" == typeof setHighlightTheme && setHighlightTheme(), $(".toc").toggleClass(dark), $(".actions").toggleClass(dark))
    },
    darkTables = function () {
        var e = $(".dream-single table");
        e.length && e.map(function () {
            this.style.color ? this.style.color = "" : this.style.color = "black"
        })
    },
    darkPostsSection = function () {
        var e = $(".ui.segment.dream-posts-section");
        e.length && e.toggleClass(dark)
    },
    darkTagsSection = function () {
        var e = $(".ui.segment.dream-tags-section");
        e.length && e.toggleClass(dark)
    },
    darkCategoriesSection = function () {
        var e = $(".ui.segment.dream-categories-section");
        e.length && e.toggleClass(dark)
    },
    darkBack = function () {
        var e = $(".dream-back .ui.segment");
        e.length && e.toggleClass(dark)
    },
    darkFooter = function () {
        $("footer.ui.segment").toggleClass(dark)
    },
    darkCallout = function () {
        var e = $(".callout");
        var a = $(".callout-summray");
        e.length && e.toggleClass(dark)
        a.length && a.toggleClass(dark)
    };

function toggleDark() {
    dark404(), darkBackground(), darkNavMenu(), darkHeaderElements(), darkCards(), darkSingle(), darkTables(), darkPostsSection(), darkTagsSection(), darkCategoriesSection(), darkBack(), darkFooter(), darkCallout()
}
var setThemeForUtterances = function () {
    var e = document.querySelector("iframe.utterances-frame");
    e && e.contentWindow.postMessage({
        type: "set-theme",
        theme: "y" === isDark ? "github-dark" : "github-light"
    }, "https://utteranc.es")
};
window.addEventListener("message", function (e) {
    "https://utteranc.es" === e.origin && setThemeForUtterances()
});
var iconSwitchs = $(".theme-switch");

function themeSwitch() {
    isDark = "y" === isDark ? (iconSwitchs.removeClass("moon"), iconSwitchs.addClass("sun"), localStore.setItem("hugo-theme-dream-is-dark", "n"), "n") : (iconSwitchs.removeClass("sun"), iconSwitchs.addClass("moon"), localStore.setItem("hugo-theme-dream-is-dark", "y"), "y"), toggleDark()
}
"y" === isDark ? (iconSwitchs.addClass("moon"), toggleDark()) : iconSwitchs.addClass("sun");
