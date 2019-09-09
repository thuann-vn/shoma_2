import { Notifications} from 'expo';
import Constants from 'expo-constants';
import NotificationTypes from '../constants/NotificationTypes';
import moment from 'moment';

export const configureDailyNotification = async (title, message)=>{
    const localNotification = {
        title: title,
        body: message,
        data: { type: NotificationTypes.remind },
        android: {
            sound: true,
        },
        ios: {
            sound: true,
        },
    };
    return await Notifications.scheduleLocalNotificationAsync(localNotification, {
        repeat: 'day',
        time: moment().hour(20).minute(0).second(0).toDate()
    });
}

export const cancelScheduledTransactionNotification = async (transaction)=>{
    if(transaction.notificationId){
        await Notifications.cancelScheduledNotificationAsync(transaction.notificationId);
    }
}


export const getNotificationToken = async () => {
    let deviceToken = '';
    try{
        if(Constants.appOwnership == 'standalone'){
            deviceToken = await Notifications.getDevicePushTokenAsync();
        }
    }catch(ex){}

    return {
        expoToken: await Notifications.getExpoPushTokenAsync(),
        deviceToken: deviceToken
    }
}

export const configureRemindNotification =  async (transaction, id, title, body)=>{
    //Cancel old reminder first
    if(transaction.notificationId){
        await Notifications.cancelScheduledNotificationAsync(transaction.notificationId);
    }

    if (transaction.reminder){
        const localNotification = {
            title: title,
            body: body,
            data: { type: NotificationTypes.remind, transactionId: id },
            android: {
                sound: true,
            },
            ios: {
                sound: true,
            },
        };
        transaction.notificationId = await Notifications.scheduleLocalNotificationAsync(localNotification, {
            time: moment(transaction.reminder).toDate()
        });
    }
    return transaction;
}

export const cancelNotification = async (id)=>{
    return await Notifications.cancelScheduledNotificationAsync(id);
}

export const clearNotificationBadge = async()=>{
    return await Notifications.setBadgeNumberAsync(0);
}

export const setNotificationBadge = async (number) => {
    return await Notifications.setBadgeNumberAsync(number);
}