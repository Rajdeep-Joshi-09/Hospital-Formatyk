import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC9CutLTZiAzv6tM3foC89faq5taykbxFo",
  authDomain: "hospital-formatyk.firebaseapp.com",
  projectId: "hospital-formatyk",
  storageBucket: "hospital-formatyk.firebasestorage.app",
  messagingSenderId: "692519384682",
  appId: "1:692519384682:web:94711a0d682674c4453c13"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        // VAPID key is usually needed for web push, but Firebase might work without it if configured properly, 
        // however it's highly recommended to generate a VAPID key in Project Settings -> Cloud Messaging -> Web configuration
        // For this demo, we'll just request a token which should work if the setup is right.
      });
      return token;
    }
  } catch (error) {
    console.error('An error occurred while requesting notification permission:', error);
  }
  return null;
};
