
export class Gift {
    // see firestore rules    https://console.firebase.google.com/project/g2t-bd737/firestore/rules  
    added_by_uid: string 
    deleted: boolean = false
    displayName: string
    docId?: string
    item: string
    link?: string
    phoneNumber: string
    reserved: boolean = false
    reserved_by_displayName?: string
    reserved_by_phoneNumber?: string
    reserved_by_uid?: string
    reserved_time_ms?: number
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
            time_ms: this.time_ms,
            uid: this.uid
        }
        if(this.docId) obj['docId'] = this.docId
        if(this.link) obj['link'] = this.link
        if(this.reserved_by_displayName) obj['reserved_by_displayName'] = this.reserved_by_displayName
        if(this.reserved_by_phoneNumber) obj['reserved_by_phoneNumber'] = this.reserved_by_phoneNumber
        if(this.reserved_by_uid) obj['reserved_by_uid'] = this.reserved_by_uid
        if(this.reserved_time_ms) obj['reserved_time_ms'] = this.reserved_time_ms
        return obj
    }
}
