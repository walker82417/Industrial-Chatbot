window.industrialAuthService = {
  isConfigured() {
    return Boolean(window.industrialFirebase && window.industrialFirebase.auth);
  },

  async signUp({ fullName, companyName, phoneNumber, jobTitle, email, password }) {
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
        jobTitle,
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

    const { auth, database } = window.industrialFirebase;
    const credential = await auth.signInWithEmailAndPassword(email, password);
    const { user } = credential;

    if (database) {
      try {
        const snapshot = await database.ref(`users/${user.uid}/subscription`).once('value');
        const subscription = snapshot.val();
        if (subscription) {
          window.localStorage.setItem('subscription', JSON.stringify(subscription));
        } else {
          window.localStorage.removeItem('subscription');
        }
      } catch (error) {
        console.error('Could not restore subscription after sign in.', error);
      }
    }

    return user;
  },

  async sendPasswordReset(email) {
    if (!this.isConfigured()) {
      throw new Error("Firebase is not configured yet.");
    }

    const sanitizedEmail = (email || "").trim();
    if (!sanitizedEmail) {
      throw new Error("Please enter your email address first.");
    }

    const { auth } = window.industrialFirebase;
    await auth.sendPasswordResetEmail(sanitizedEmail);
  }
};
