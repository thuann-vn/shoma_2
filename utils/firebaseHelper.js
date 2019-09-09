import { getBlob } from "./blobHelper";

/**
 * Update notification token
 */
export const insertOrUpdateNotificationToken = (firebase, enabledReceiveNotification = true, token, language = 'vi', currency = 'USD', timezoneOffset = 0) => {
    const user = firebase.auth().currentUser;

    const data = {
        enabled: enabledReceiveNotification,
        latestDate: new Date(),
        language: language,
        currency: currency,
        timezoneOffset: timezoneOffset,
        tokens: token ? token: ''
    }

    //Set enable status
    firebase.database().ref('notifications/' + user.uid).set(data);
    return;
}

/**
 * Update notification settings
 * @param {*} firebase 
 * @param {*} data 
 */
export const updateNotificationSettings = (firebase, data) => {
    const user = firebase.auth().currentUser;

    //Set enable status
    firebase.database().ref('notifications/' + user.uid + '/settings').set(data);
    return;
}

/**
 * Post image
 * @param {*} firebase 
 * @param {*} category 
 * @param {*} uri 
 */
export const postImage = async (firebase, name, uri) => {
    const user = firebase.auth().currentUser;
    const blob = await getBlob(uri);

    var ref = firebase.storage().ref('images').child(user.uid).child(name + '.jpeg');
    const snapshot = await ref.put(blob, {
        contentType: 'image/jpeg'
    });

    if (snapshot.state == 'success') {
        return url = await ref.getDownloadURL();
    } else {
        console.log('Save image error', snapshot);
        return uri;
    }
}