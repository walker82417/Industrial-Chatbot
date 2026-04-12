Mega Project 2025-26
Task 1 Status
Front End - 20% ( waiting for the next upgradation )
Backend - 5 %
Hardware - 0 %


## Online setup starter

This project is now prepared for:

- **Vercel** static frontend deployment
- **Firebase Authentication** for sign up and sign in
- **Firebase Realtime Database** for online user profile storage

### Files added for the online setup

- `vercel.json` configures Vercel for the current static HTML structure.
- `js/firebase-config.example.js` is the template for your Firebase web app credentials.
- `js/firebase-init.js` initializes Firebase in the browser.
- `js/auth-service.js` contains shared sign-up and sign-in helpers.

### Before deploying

1. Create a Firebase project.
2. Enable **Authentication** with **Email/Password**.
3. Enable **Realtime Database**.
4. Either:
   - copy `js/firebase-config.example.js` to `js/firebase-config.js`, or
   - open `firebase-setup.html` in the browser and paste your Firebase web app config there.
5. Deploy the repository to Vercel.

### Vercel deployment steps

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Use the default static deployment settings.
4. After each update, redeploy from Vercel or push a new commit.
