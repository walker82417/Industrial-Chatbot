(function initializeFirebaseApp() {
  const STORAGE_KEY = "industrialFirebaseConfig";
  const readStoredConfig = () => {
    try {
      const savedConfig = window.localStorage.getItem(STORAGE_KEY);
      return savedConfig ? JSON.parse(savedConfig) : null;
    } catch (error) {
      console.error("Could not read Firebase config from localStorage.", error);
      return null;
    }
  };

  const config = window.INDUSTRIAL_FIREBASE_CONFIG || readStoredConfig();
  window.industrialFirebaseConfig = config || null;
  window.industrialFirebaseConfigStatus = {
    hasConfig: Boolean(config),
    storageKey: STORAGE_KEY
  };

  if (!config) {
    console.warn(
      "Firebase config not found. Open firebase-setup.html or create js/firebase-config.js with your Firebase project values."
  const config = window.INDUSTRIAL_FIREBASE_CONFIG;

  if (!config) {
    console.warn(
      "Firebase config not found. Copy js/firebase-config.example.js to js/firebase-config.js and fill in your Firebase project values."
    );
    return;
  }

  window.INDUSTRIAL_FIREBASE_CONFIG = config;

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
