import admin from 'firebase-admin';
import { config } from './index';

if (!admin.apps.length) {
  const { projectId, clientEmail, privateKey } = config.firebase;
  const isRealPrivateKey =
    privateKey &&
    privateKey.includes('BEGIN PRIVATE KEY') &&
    !privateKey.includes('XXXXXXXX');

  if (projectId && clientEmail && isRealPrivateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('🔥 Firebase Admin SDK initialized successfully');
    } catch (err) {
      console.warn('⚠️ Firebase Admin SDK initialization failed:', err);
    }
  } else {
    console.warn('⚠️ Firebase Admin SDK not fully configured in .env (Auth running in dev mode)');
  }
}

export const auth = admin.apps.length ? admin.auth() : ({
  verifyIdToken: async (token: string) => {
    // Development mock token handler when Firebase credentials aren't set yet
    if (process.env.NODE_ENV === 'development') {
      return {
        uid: token.replace('Bearer ', ''),
        role: 'patient',
        email: 'dev@patient.local',
      };
    }
    throw new Error('Firebase Auth not configured');
  },
  setCustomUserClaims: async (uid: string, claims: object) => {
    console.log(`[Dev Mock] Custom claims set for ${uid}:`, claims);
  },
} as any);

export default admin;