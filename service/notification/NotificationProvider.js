import NotificationStrategy from './NotificationStrategy';

const NotificationProvider = (() => {
    let notificationInstance;

    function createNotificationProvider() {
        notificationInstance = new NotificationStrategy();
        return notificationInstance;
    }

    return {
        getNotificationProvider() {
            if (!notificationInstance) {
                return createNotificationProvider();
            }
            return notificationInstance;
        }
    };
})();

export default NotificationProvider;
