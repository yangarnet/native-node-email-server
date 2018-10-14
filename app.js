import server from './service/emailserver/server';
import Worker from './service/worker/worker';
import NotificationProvider from './service/notification/NotificationProvider';
import config from './service/emailserver/env/config';

const app = {
    worker: new Worker(NotificationProvider.getNotificationProvider()),
    init() {
        config();
        server.init();
        this.worker.init();
    }
};

app.init();

export default app;
