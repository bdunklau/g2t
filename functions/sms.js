
const functions = require('firebase-functions');
const twilio = require('twilio');
const admin = require('firebase-admin');
const _ = require('lodash')

// can only call this once globally and we already do that in index.js
//admin.initializeApp(functions.config().firebase);
var db = admin.firestore();

let WELCOME = 'welcome text'
let MAIN_MENU = 'Main Menu'
let ADD_ITEM_FOR_ME = "add item for me"
let ENTER_NAME_GET_GIFT_IDEA = "enter name - get gift idea"
let ADD_FRIENDS_AND_FAMILY = "add friends/family"
let ENTER_FRIEND_NAME = "Enter friend's name"
let ENTER_FRIEND_PHONE = "Enter friend's phone"
let CONFIRM_INFO = "Is this correct?\n"
// let sms_types = [WELCOME, MAIN_MENU, ADD_ITEM_FOR_ME]


exports.receive = functions.https.onRequest(async (req, res) => {

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
    
    
    const querySnapshot = await db.collection('user').where('phoneNumber', '==', req.body.From).limit(1).get()
    let user
    querySnapshot.forEach(doc => {
        user = doc.data()
    })



    if(user.required_info === 'name') {
        let fn = async function() {await this.sendMainMenu({user: user})}.bind(this)

        // get the req.body.Body - that's the user's reply
        // then look up the user's account using req.body.From
        // user's account will have a 'required_info' field  i.e. see welcomeText() below
        // 'required_info' tells us what req.body.Body is
        return db.collection('user').doc(user.uid)
            .update({displayName: req.body.Body.trim(), displayName_lowerCase: req.body.Body.trim().toLowerCase(), required_info: null})
            .then(() => {
                return fn()
            })
    }
    else if(req.body.Body.trim() === '?') {
        // send the main menu
        await sendMainMenu({user: user})
    }
    else {
        handleUserInput(user, user.last_sms_type, req.body.Body)
    }





    // console.log('userDoc: ', userDoc)
    // console.log('userDoc[0]: ', userDoc[0])
    // console.log('userDoc[0].data(): ', userDoc[0].data())
    // if(userDoc && userDoc.data() && userDoc.data().required_info && req.body.Body.trim() !== '') {
    //     if(userDoc.data().required_info === 'name') {

    //         db.collection('user').doc(userDoc.data().uid).update({displayName: req.body.Body.trim(), displayName_lowerCase: req.body.Body.trim().toLowerCase()})
    //     }
    // }
    return res.status(200).send('ok')

})



/**
 * See also   auth.js:createAccount()
 * Lesson Learned:  Don't prompt for name here.  Instead, do nothing OR send the user link to /home page
 * because that page has the MinimalAccountInfoGuard attached to it which will send the user to /minimal-account-info page
 * That page prompts the user for name
 */
exports.welcomeText = functions.firestore.document('user/{uid}').onCreate(async (snap, context) => {
    let msg = `Thanks for joining Gift2Text.com !`

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
                return db.collection('user').doc(userData.uid)
                    .update({last_sms_type:WELCOME, 
                             last_sms_time_ms: new Date().getTime(),
                             /*required_info: 'name'*/ })
            });

    }

    
})


var sendMainMenu = async function(args) {

    const doc = await db.collection('config').doc('twilio').get()
    
    const client = twilio(doc.data().twilio_account_sid, doc.data().twilio_auth_key);
        
    var details = {};
    details.to = args.user.phoneNumber 
    details.from = doc.data().twilio_phone
    let beforeMessage = args.beforeMessage ? args.beforeMessage+'\n' : ''
    details.body = beforeMessage + getMenu(MAIN_MENU) //'Main Menu\n1 - add item for me\n? - main menu'

    return client.messages
        .create(details)
        .then((message) => { 
            return db.collection('user').doc(args.user.uid).update({last_sms_type:MAIN_MENU, last_sms_time_ms: new Date().getTime()})
        });
}


var sendSms = async function(args) {

    const doc = await db.collection('config').doc('twilio').get()
    
    const client = twilio(doc.data().twilio_account_sid, doc.data().twilio_auth_key);
        
    var details = {};
    details.to = args.user.phoneNumber 
    details.from = doc.data().twilio_phone
    details.body = args.message

    return client.messages
        .create(details)
        .then((message) => { 
            return db.collection('user').doc(args.user.uid).update({last_sms_type:args.sms_type, last_sms_time_ms: new Date().getTime()})
        });
}


var sendSms2 = async function(args) {

    const doc = await db.collection('config').doc('twilio').get()
    
    const client = twilio(doc.data().twilio_account_sid, doc.data().twilio_auth_key);
        
    var details = {};
    details.to = args.phoneNumber 
    details.from = doc.data().twilio_phone
    details.body = args.message

    return client.messages
        .create(details)
        // .then((message) => {  // DON'T NEED THIS
        //     return db.collection('user').doc(args.user.uid).update({last_sms_type:args.sms_type, last_sms_time_ms: new Date().getTime()})
        // });
}


var promptForItemForMe = function(args) {
    sendSms({user: args.user, message: "Enter item or link to item", sms_type: ADD_ITEM_FOR_ME}) 
}

var promptForFriendName = function(args) {
    let sms_type = args.sms_type ? args.sms_type : ADD_FRIENDS_AND_FAMILY
    sendSms({user: args.user, message: ENTER_FRIEND_NAME, sms_type: sms_type}) 
}


var addItemForMe = function(args) {
    let item = args.input
    if(isAmazon(args.input)) {
        item = addAffiliateTag(args.input)
    }
    return db.collection('gift').add({uid: args.user.uid, displayName: args.user.displayName, phoneNumber: args.user.phoneNumber, item: item, time_ms: new Date().getTime(), reserved: false})
        .then(() => {
            args.beforeMessage = '*** Confirmed: Item added ***'
            sendMainMenu(args)
            return true
        })
}


var setFriendName = function(args) {
    return db.collection('user').doc(args.user.uid).update({new_friend_name: args.input})
        .then(() => {
            // reply asking for the person's phone number
            return sendSms({user: args.user, message: ENTER_FRIEND_PHONE, sms_type: ENTER_FRIEND_NAME}) 
        })
}


var setFriendPhone = function(args) {
    return db.collection('user').doc(args.user.uid).update({new_friend_phone: args.input})
        .then(() => {
            let message = CONFIRM_INFO+'name: '+args.user.new_friend_name+'\nphone: '+args.input+'\n1 - yes\n2 - no'
            return sendSms({user: args.user, message: message, sms_type: ENTER_FRIEND_PHONE}) 
        })
}


var confirmFriend = async function(args) {
    //  1 - yes,  2 - no (needs correcting)
    if(args.input === '1') {
        /* need to?  await*/ db.collection('friend').add({creator_uid: args.user.uid, creator_name: args.user.displayName, 
            time_ms: new Date().getTime(), phoneNumber: '+1'+args.user.new_friend_phone, displayName: args.user.new_friend_name.trim(),
            displayName_lowerCase: args.user.new_friend_name.trim().toLowerCase()})
        
        /* need to?  await*/ db.collection('user').doc(args.user.uid)
            .update({new_friend_name: admin.firestore.FieldValue.delete(), new_friend_phone: admin.firestore.FieldValue.delete()})

        // TODO also need to query 'user' collection by phone number to see if this person already exists
        // If not, have to sms the person a link to Gift2Text.com
        let textAnyway = true // just for testing then turn off
        let userSnapshot = await db.collection('user')
                            .where('phoneNumber', '==', '+1'+args.user.new_friend_phone).limit(1).get()
        if(userSnapshot.empty || textAnyway) {
            let message = args.user.displayName+" invited you to join Gift2Text.com\nGo to Gift2Text.com to confirm your phone number.\nIf you have questions about "
                            +"Gift2Text.com, you can contact "+args.user.displayName+" at "+args.user.phoneNumber
            sendSms2({phoneNumber: '+1'+args.user.new_friend_phone, message: message}) 
        }


        // not yet handling whether new friend is already a registered user or not
        args.beforeMessage = '*** Confirmed: friend added ***'
        sendMainMenu(args)
        return true 
    }
    else {
        // anything other than 1 means, go back and correct
        promptForFriendName(args)
    }
}


var beginGetGiftIdea = function(args) {
    args.sms_type = ENTER_NAME_GET_GIFT_IDEA
    promptForFriendName(args)
}


var getGiftIdea = async function(args) {
    let name = args.input.trim().toLowerCase()
    const end = name.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1)); // https://stackoverflow.com/a/57290806
    const querySnapshot = await db.collection('friend')
                                    .where('displayName_lowerCase', '>=', name) // so we can enter just first name if we want to
                                    .where('displayName_lowerCase', '<', end)
                                    .limit(1).get()
    let friend
    querySnapshot.forEach(doc => {
        friend = doc.data()
    })
    // now look up gift
    let giftSnapshot = await db.collection('gift')
                        .where('phoneNumber', '==', friend.phoneNumber)
                        .where('displayName', '==', friend.displayName)
                        .where('reserved', '==', false).limit(1).get()


    let foundGift
    giftSnapshot.forEach(doc => {
        foundGift = doc.data()
    })
    if(foundGift) {
        let isThisRight = ENTER_NAME_GET_GIFT_IDEA
        return sendSms({user: args.user, message: foundGift.displayName+" wants this\n\n"+foundGift.item, sms_type: isThisRight}) 
    }
    else {
        let isThisRight = ENTER_NAME_GET_GIFT_IDEA
        return sendSms({user: args.user, message: friend.displayName+"'s list is empty", sms_type: isThisRight}) 
    }
}



let selections = [
    {name: ADD_ITEM_FOR_ME, func: addItemForMe },
    {name: ADD_FRIENDS_AND_FAMILY, func: setFriendName },
    {name: ENTER_FRIEND_NAME, func: setFriendPhone },
    {name: ENTER_FRIEND_PHONE, func: confirmFriend },
    {name: ENTER_NAME_GET_GIFT_IDEA, func: getGiftIdea },
]


let menus = [
    {name: MAIN_MENU,
     selections: [
         {num: "1", text: ADD_ITEM_FOR_ME, func: promptForItemForMe},
         {num: "2", text: ENTER_NAME_GET_GIFT_IDEA, func: beginGetGiftIdea },
         {num: "3", text: "add item for someone else", func: (args) => {console.log('add item for someone else')}},
         {num: "4", text: "view my list", func: (args) => {console.log('view my list')}},
         {num: "5", text: "delete item for me", func: (args) => {console.log('delete item for me')}},
         {num: "6", text: "delete item for someone else", func: (args) => {console.log('delete item for someone else')}},
         {num: "7", text: ADD_FRIENDS_AND_FAMILY, func: promptForFriendName },
         {num: "?", text: MAIN_MENU, func: (args) => {console.log(MAIN_MENU)}}
     ]
    }
]


var handleUserInput = function(user, sms_type, input) {
    // which menu...
    let menu = _.find(menus, menu => { return menu.name === sms_type })
    if(menu) {
        let selectedMenuItem = _.find(menu.selections, sel => { return sel.num === input })    
        if(selectedMenuItem) {
            return db.collection('user').doc(user.uid)
                .update({last_sms_type: selectedMenuItem.text, last_sms_time_ms: new Date().getTime()  })
                .then(() => {
                    return selectedMenuItem.func({user: user, sms_type: selectedMenuItem.text})
                })
        }

    }
    
    else {
        let sel2 = _.find(selections, sel => { return sel.name === user.last_sms_type })
        console.log( 'selections = ', selections )
        console.log( 'user.last_sms_type = ', user.last_sms_type )
        console.log( 'sel2 = ', sel2 )
        if(sel2) {
            return sel2.func({user: user, sms_type: sms_type, input: input})
        }
        else return true
    }
}


var isAmazon = function(str) {
    return str && (
        str.startsWith('https://www.amazon.com') || str.startsWith('http://www.amazon.com') || 
        str.startsWith('https://amazon.com') || str.startsWith('http://amazon.com') || 
        str.startsWith('www.amazon.com') || str.startsWith('amazon.com') 
    )
}

var addAffiliateTag = function(str) {
    let qmark = str.indexOf('?')
    if(qmark !== -1) {
        str = str.substring(0, qmark)
    }
    return str + '?tag=gift2text-20'
}


var getMenu = function(menu_name) {
    let menu = _.find(menus, menu => { return menu.name === menu_name })
    let zzz = _.map(menu.selections, selection => {
        return selection.num+' - '+selection.text
    })
    let yyy = _.join(zzz, "\n")
    let text = menu_name+'\n'+yyy
    return text
}
