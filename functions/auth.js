
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// can only call this once globally and we already do that in index.js
//admin.initializeApp(functions.config().firebase);
var db = admin.firestore();


/**
 * See also   sms.js:welcomeText()
 */
exports.createAccount = functions.auth.user().onCreate(user => {
    return db.collection('user').doc(user.uid).set({uid: user.uid, phoneNumber: user.phoneNumber, time_ms: new Date().getTime()})
})

exports.deleteAccount = functions.auth.user().onDelete(user => {
    return db.collection('user').doc(user.uid).delete()
})
