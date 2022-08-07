/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js');
/* eslint-disable no-undef */
const firebaseConfig = {
  apiKey: 'AIzaSyDmh1cgmJvE0MjIH6qpZnSUHoJWEKwU4sg',
  authDomain: 'tripi-social-portal---develop.firebaseapp.com',
  projectId: 'tripi-social-portal---develop',
  storageBucket: 'tripi-social-portal---develop.appspot.com',
  messagingSenderId: '697407071357',
  appId: '1:697407071357:web:678d0aee9668c017887d14',
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
// messaging.setBackgroundMessageHandler((payload) => {
//   console.log('payload', payload);
//   const promiseChain = clients
//     .matchAll({
//       type: 'window',
//       includeUncontrolled: true,
//     })
//     .then((windowClients) => {
//       for (let i = 0; i < windowClients.length; i++) {
//         const windowClient = windowClients[i];
//         windowClient.postMessage(payload?.data?.type);
//       }
//     })
//     .then(() => {
//       return registration.showNotification('my notification title');
//     });
//   return promiseChain;
// });
// eslint-disable-next-line
self.addEventListener('notificationclick', function(event) {
  // handle click notification
});
// eslint-disable-next-line
// self.addEventListener('push', event => {
//   const data = event.data ? event.data.json() : {};
//   console.log('=========data', data);
//   // const content = JSON.parse(data.data.vi);
//   const content = data.notification;
//   self.registration.showNotification(content.title, {
//     body: content.body,
//     // icon: './logo.png',
//   });
// });
