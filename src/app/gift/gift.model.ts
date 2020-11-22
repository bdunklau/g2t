
export class Gift {
    // see firestore rules    https://console.firebase.google.com/project/g2t-bd737/firestore/rules  
    added_by_uid: string 
    deleted: boolean = false
    deliver_ms?: number  // date in ms when gift will be given
    displayName: string
    docId?: string
    item: string
    link?: string
    linkedGiftId?: string 
    otherRecipients?: {giftId: string, displayName: string, phoneNumber: string, uid: string}[]
    phoneNumber: string
    reserved: boolean = false
    reserved_by_displayName?: string
    reserved_by_phoneNumber?: string
    reserved_by_uid?: string
    reserved_time_ms?: number
    surprise = false
    time_ms: number
    uid: string

    toObj() {
        let obj = {  
            added_by_uid: this.added_by_uid,
            deleted: this.deleted,
            displayName: this.displayName,
            item: this.item,
            phoneNumber: this.phoneNumber,
            reserved: this.reserved,
            surprise: this.surprise,
            time_ms: this.time_ms,
            uid: this.uid
        }
        if(this.deliver_ms) obj['deliver_ms'] = this.deliver_ms
        if(this.docId) obj['docId'] = this.docId
        if(this.link) obj['link'] = this.link
        if(this.linkedGiftId) obj['linkedGiftId'] = this.linkedGiftId
        if(this.reserved_by_displayName) obj['reserved_by_displayName'] = this.reserved_by_displayName
        if(this.otherRecipients) obj['otherRecipients'] = this.otherRecipients
        if(this.reserved_by_phoneNumber) obj['reserved_by_phoneNumber'] = this.reserved_by_phoneNumber
        if(this.reserved_by_uid) obj['reserved_by_uid'] = this.reserved_by_uid
        if(this.reserved_time_ms) obj['reserved_time_ms'] = this.reserved_time_ms
        return obj
    }

    clone(gift: Gift) {
        this.added_by_uid = gift.added_by_uid
        this.deleted = gift.deleted
        this.deliver_ms = gift.deliver_ms
        this.displayName = gift.displayName
        this.docId = gift.docId
        this.item = gift.item
        this.link = gift.link
        this.linkedGiftId = gift.linkedGiftId
        this.otherRecipients = gift.otherRecipients ? gift.otherRecipients : []
        this.phoneNumber = gift.phoneNumber
        this.reserved = gift.reserved
        this.reserved_by_displayName = gift.reserved_by_displayName
        this.reserved_by_phoneNumber = gift.reserved_by_phoneNumber
        this.reserved_by_uid = gift.reserved_by_uid
        this.reserved_time_ms = gift.reserved_time_ms
        this.surprise = gift.surprise
        this.time_ms = gift.time_ms
        this.uid = gift.uid
    }
}

