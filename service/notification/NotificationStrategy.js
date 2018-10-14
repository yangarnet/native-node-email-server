
class NotificationStrategy {

    constructor(notificationProvider) {
        this.notificationProvider = notificationProvider;
    }

    setNotificationProvider(notificationProvider) {
        this.notificationProvider = notificationProvider;
    }
    getNotificationProvider() {
        return this.notificationProvider;
    }

    notify(message, cb) {
        this.notificationProvider.send(message, cb);
    }

    setStatus(status) {
        this.notificationProvider.setStatus(status);
    }

    getStatus() {
        this.notificationProvider.getStatus();
    }
}

export default NotificationStrategy;
