// Consent-gated Google Analytics (GA4). Nothing analytics-related loads
// until a visitor actively accepts — no cookie is set, no request to
// Google fires, before that click. Respects Do Not Track / Global Privacy
// Control by skipping the prompt (and analytics) entirely, same as
// declining.
//
// Real GA4 Web stream Measurement ID (analytics.google.com → Admin →
// Data Streams → the Web stream for this site — not the iOS app's
// Firebase stream, which has no G-... ID at all).
const GA_MEASUREMENT_ID = "G-XB4E3JP74V";

const CONSENT_KEY = "cs_analytics_consent";

function loadGoogleAnalytics() {
  if (GA_MEASUREMENT_ID.includes("XXXXXXXXXX")) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
}

function honoursDoNotTrack() {
  return navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true;
}

function initConsentBanner() {
  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === "accepted") { loadGoogleAnalytics(); return; }
  if (stored === "declined" || honoursDoNotTrack()) return;

  const banner = document.getElementById("cookie-banner");
  if (!banner) return;
  banner.hidden = false;

  banner.querySelector(".accept").addEventListener("click", () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    banner.hidden = true;
    loadGoogleAnalytics();
  });
  banner.querySelector(".decline").addEventListener("click", () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    banner.hidden = true;
  });
}

// Screenshot light/dark toggle — explicit, not left to silently follow
// `prefers-color-scheme` alone, so a visitor browsing in dark mode can
// still see the light screenshots (and vice versa) instead of one set
// being invisible the whole time.
function initScreenshotToggle() {
  const grid = document.getElementById("shots-grid");
  const buttons = document.querySelectorAll("[data-theme-choice]");
  if (!grid || !buttons.length) return;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setShotTheme(prefersDark ? "dark" : "light");

  function setShotTheme(theme) {
    grid.dataset.shotTheme = theme;
    buttons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.themeChoice === theme));
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => setShotTheme(btn.dataset.themeChoice));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initConsentBanner();
  initScreenshotToggle();
});
