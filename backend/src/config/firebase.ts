import admin from 'firebase-admin';

export const initializeFirebase = () => {
  if (admin.apps.length === 0) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }
};

export const db = admin.firestore();
export const auth = admin.auth();
export const messaging = admin.messaging();

export default admin;
