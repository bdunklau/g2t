
export class Gift {
    // see firestore rules    https://console.firebase.google.com/project/g2t-bd737/firestore/rules   
    deleted: boolean = false
    displayName: string
    item: string
    link?: string
    phoneNumber: string
    reserved: boolean = false
    time_ms: number
    uid: string

}

