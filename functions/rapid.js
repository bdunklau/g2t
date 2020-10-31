
const functions = require('firebase-functions');
const twilio = require('twilio');
const sms = require('./sms');


exports.foo = functions.https.onRequest(async (req, res) => {

    return res.status(200).send(JSON.stringify({result: 'ok - foo'}))

})


exports.fooSms = functions.https.onRequest((req, res) => {

    //G2T_TWILIO_ACCOUNT_SID,  
    let keys = {twilio_account_sid: req.body.twilio_account_sid, twilio_auth_key: req.body.twilio_auth_key}
    
    var details = {};
    details.to = req.body.user_phone 
    details.from = req.body.g2t_phone 
    details.body = req.body.message;
    // if(snap.data().mediaUrl) details.mediaUrl = [snap.data().mediaUrl];

    // require the Twilio module and create a REST client
    const client = twilio(keys.twilio_account_sid, keys.twilio_auth_key);
    return client.messages
        .create(details)
        .then((message) => {
            return res.status(200).send(JSON.stringify({message: req.body.message, twilio_message_sid: message.sid}))
        });

})
