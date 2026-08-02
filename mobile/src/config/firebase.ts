import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBIS9Q0W64Lcks0ZwHBndQCfEuItpXxgE4",
  authDomain: "ai-health-3b276.firebaseapp.com",
  projectId: "ai-health-3b276",
  storageBucket: "ai-health-3b276.firebasestorage.app",
  messagingSenderId: "723850448564",
  appId: "1:723850448564:web:d59b828fa722fa0f1611e1",
  measurementId: "G-C8KL7XFWEL"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export default app;
