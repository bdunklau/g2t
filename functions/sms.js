
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



/**
 * See also   auth.js:createAccount()
 */
exports.welcomeText = functions.firestore.document('user/{uid}').onCreate(async (snap, context) => {
    let msg = `Thanks for joining Gift2Text.com!  What's your name?`

    let userData = snap.data()

    const doc = await db.collection('config').doc('twilio').get()
    // const doc = await twilioRef.get();
    if (!doc.exists) {
        console.log('No such document!');
        // THIS IS AN ERROR
        return true;
    } else {
        console.log('Document data:', doc.data());
        
        var details = {};
        details.to = userData.phoneNumber 
        details.from = doc.data().twilio_phone
        details.body = msg
        // if(snap.data().mediaUrl) details.mediaUrl = [snap.data().mediaUrl];

        // require the Twilio module and create a REST client
        const client = twilio(doc.data().twilio_account_sid, doc.data().twilio_auth_key);
        return client.messages
            .create(details)
            .then((message) => {
                return true
                // DO WHAT HERE?
                // return res.status(200).send(JSON.stringify({message: req.body.message, twilio_message_sid: message.sid}))
            });

    }

    


})
