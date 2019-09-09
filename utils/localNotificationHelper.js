import v1 from 'uuid';
import R from 'ramda';
import { clearNotificationBadge } from './notificationHelper';
export const insertNotification = (props, type, message, data) => {
    const notification = {
        id: v1(),
        date: new Date(),
        data: data,
        type: type,
        message: message,
        isRead: false
    }

    props.addNotification(notification);
    return notification;
}

export const getListNotifications = (notifications, pageSize = 10, page = 1) => {
    return R.groupBy((item) => {
        return item.isRead ? 'notification_read' : 'notification_not_read_yet'
    },sortByDate(R.values(notifications.list)));
}

export const sortByDate = (notifications) => {
    return R.sort((a, b) => {
        return a.date < b.date
    }, notifications);
}

export const countNotifications = (notifications, unReadOnly = true)=>{
    let count = 0;
    R.map((notification)=>{
        count += notification.isRead ? 0 : 1;
    }, R.values(notifications.list));
    return count;
}

export const clearUnreadNotifications = (props) => {
    R.map((item) => {
        if(!item.isRead){
            item.isRead = true;
            props.updateNotification(item);
        }
    }, R.values(props.notifications.list));

    clearNotificationBadge();
}