
const functions = require('firebase-functions');
const twilio = require('twilio');
const admin = require('firebase-admin');

// can only call this once globally and we already do that in index.js
//admin.initializeApp(functions.config().firebase);
var db = admin.firestore();

exports.receive = functions.https.onRequest((req, res) => {

    /**
     * req.body....
     * 
     *  AccountSid
        ApiVersion  i.e.  “2010-04-01”
        Body  here's the message
        From  i.e.  “+15555555555”
        FromCity
        FromCountry
        FromState
        FromZip
        MessageSid
        NumMedia  i.e.  “0”
        NumSegments  i.e.  “1”
        SmsMessageSid
        SmsSid
        SmsStatus  i.e.  “received”
        To   i.e.  “+15555554444”
        ToCity
        ToCountry
        ToState
        ToZip
     * 
     */
    
    return db.collection('foo').add({body: req.body}).then(() => {
        return res.status(200).send('ok')
    })


})
