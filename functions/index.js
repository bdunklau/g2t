
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


admin.initializeApp();

const rapid = require('./rapid');
exports.foo = rapid.foo;
exports.fooSms = rapid.fooSms

const sms = require('./sms');
exports.receive = sms.receive;