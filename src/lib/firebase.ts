import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfigJson from "../../firebase-applet-config.json";

function getEnvOrConfig(key: string, jsonKey: keyof typeof firebaseConfigJson): string {
  const value = import.meta.env[key];
  if (typeof value === "string" && value) {
    return value;
  }
  const configValue = firebaseConfigJson[jsonKey];
  if (typeof configValue === "string" && configValue) {
    return configValue;
  }
  return "";
}

const firebaseConfig = {
  apiKey: getEnvOrConfig("VITE_FIREBASE_API_KEY", "apiKey"),
  authDomain: getEnvOrConfig("VITE_FIREBASE_AUTH_DOMAIN", "authDomain"),
  projectId: getEnvOrConfig("VITE_FIREBASE_PROJECT_ID", "projectId"),
  storageBucket: getEnvOrConfig("VITE_FIREBASE_STORAGE_BUCKET", "storageBucket"),
  messagingSenderId: getEnvOrConfig("VITE_FIREBASE_MESSAGING_SENDER_ID", "messagingSenderId"),
  appId: getEnvOrConfig("VITE_FIREBASE_APP_ID", "appId"),
  firestoreDatabaseId: getEnvOrConfig("VITE_FIREBASE_DATABASE_ID", "firestoreDatabaseId") || "(default)",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.log("Firebase connection warming up...");
    }
  }
}

testConnection();
