(function createIndustrialAuthGuard() {
  const AUTH_CHECK_TIMEOUT_MS = 5000;

  const ensureOverlay = () => {
    if (document.getElementById("auth-guard-overlay")) {
      return;
    }

    const overlay = document.createElement("div");
    overlay.id = "auth-guard-overlay";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.background = "rgba(2, 6, 23, 0.92)";
    overlay.style.color = "#f1f5f9";
    overlay.style.fontFamily = "sans-serif";
    overlay.style.fontSize = "1rem";
    overlay.style.zIndex = "9999";
    overlay.textContent = "Checking your session...";

    document.body.appendChild(overlay);
  };

  const removeOverlay = () => {
    const overlay = document.getElementById("auth-guard-overlay");
    if (overlay) {
      overlay.remove();
    }
  };

  const getRedirectUrl = (redirectTo) => {
    const currentPath = `${window.location.pathname.split("/").pop() || "dashboard.html"}${window.location.search || ""}`;
    return `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
  };

  const redirectToFirebaseSetup = () => {
    window.location.replace(getRedirectUrl("firebase-setup.html"));
  };

  const redirectToLogin = (redirectTo) => {
    window.location.replace(getRedirectUrl(redirectTo));
  };

  const waitForAuth = (redirectTo, startedAt) => {
    if (window.industrialFirebaseConfigStatus && !window.industrialFirebaseConfigStatus.hasConfig) {
      redirectToFirebaseSetup();
      return;
    }

    const auth = window.industrialFirebase && window.industrialFirebase.auth;

    if (auth) {
      let finished = false;
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (finished) {
          return;
        }

        finished = true;
        unsubscribe();

        if (user) {
          window.currentIndustrialUser = user;
          document.body.dataset.authenticated = "true";
          removeOverlay();
          window.dispatchEvent(new CustomEvent("industrial-auth-ready", { detail: { user } }));
          return;
        }

        redirectToLogin(redirectTo);
      });

      return;
    }

    if (Date.now() - startedAt >= AUTH_CHECK_TIMEOUT_MS) {
      if (window.industrialFirebaseConfigStatus && !window.industrialFirebaseConfigStatus.hasConfig) {
        redirectToFirebaseSetup();
        return;
      }

      redirectToLogin(redirectTo);
      return;
    }

    window.setTimeout(() => waitForAuth(redirectTo, startedAt), 100);
  };

  window.industrialAuthGuard = {
    requireAuth(options = {}) {
      const redirectTo = options.redirectTo || "login.html";
      ensureOverlay();
      waitForAuth(redirectTo, Date.now());
    }
  };

  const boot = () => window.industrialAuthGuard.requireAuth();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
