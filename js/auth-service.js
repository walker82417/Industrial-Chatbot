window.industrialAuthService = {
  isConfigured() {
    return Boolean(window.industrialFirebase && window.industrialFirebase.auth);
  },

  async signUp({ fullName, companyName, phoneNumber, email, password }) {
    if (!this.isConfigured()) {
      throw new Error("Firebase is not configured yet.");
    }

    const { auth, database } = window.industrialFirebase;
    const credential = await auth.createUserWithEmailAndPassword(email, password);
    const { user } = credential;

    await user.updateProfile({
      displayName: fullName
    });

    if (database) {
      await database.ref(`users/${user.uid}`).set({
        fullName,
        companyName,
        phoneNumber,
        email,
        createdAt: new Date().toISOString()
      });
    }

    return user;
  },

  async signIn({ email, password }) {
    if (!this.isConfigured()) {
      throw new Error("Firebase is not configured yet.");
    }

    const { auth } = window.industrialFirebase;
    const credential = await auth.signInWithEmailAndPassword(email, password);
    return credential.user;
  }
};
