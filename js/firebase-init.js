(function initializeFirebaseApp() {
  const config = window.INDUSTRIAL_FIREBASE_CONFIG;

  if (!config) {
    console.warn(
      "Firebase config not found. Copy js/firebase-config.example.js to js/firebase-config.js and fill in your Firebase project values."
    );
    return;
  }

  if (!window.firebase || !window.firebase.apps) {
    console.error("Firebase SDK not loaded.");
    return;
  }

  if (!window.firebase.apps.length) {
    window.firebase.initializeApp(config);
  }

  window.industrialFirebase = {
    app: window.firebase.app(),
    auth: window.firebase.auth(),
    database: typeof window.firebase.database === "function" ? window.firebase.database() : null
  };
})();
