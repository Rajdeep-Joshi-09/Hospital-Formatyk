importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyC9CutLTZiAzv6tM3foC89faq5taykbxFo",
  authDomain: "hospital-formatyk.firebaseapp.com",
  projectId: "hospital-formatyk",
  storageBucket: "hospital-formatyk.firebasestorage.app",
  messagingSenderId: "692519384682",
  appId: "1:692519384682:web:94711a0d682674c4453c13"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
