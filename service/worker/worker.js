import https from 'https';
import url from 'url';
import MailGun from '../notification/MailGun';
import SendGrid from '../notification/SendGrid';
import help from '../common/helper';

class Worker {
    constructor(notificationProvider) {
        this.checkFrequency = 3600000;
        this.notificationProvider = notificationProvider;
    }
    init() {
        this.checkNotificationServerStatus();
        this.startMonitoring();
    }

    startMonitoring() {
        setInterval(() => {
            this.checkNotificationServerStatus();
        }, this.checkFrequency);
    };

    checkNotificationServerStatus() {
        let pickedMailgun = false;
        const mailgunOptions = {
            method: process.env.CHECK_SERVER_METHOD,
            hostname: process.env.MAILGUN_HOST_NAME,
            path: process.env.MAILGUN_CHECK_PATH,
            port: process.env.CHECK_PORT
        };

        const sendgridOptions = {
            method: process.env.CHECK_SERVER_METHOD,
            hostname: process.env.SENDGRID_HOST_NAME,
            path: process.env.SENDGRID_CHECK_PATH,
            port: process.env.CHECK_PORT,
            headers: {
                Authorization: process.env.SENDGRID_AUTH
            }
        };

        const req = https.request(sendgridOptions, res => {
            const { statusCode, statusMessage } = res;
            console.log("checking send grid server ......\n");
            if (statusCode === 200 || statusMessage === "OK") {
                pickedMailgun = false;
                console.log("send grid server OK......\n");
                this.setNotificationServer(pickedMailgun, statusCode);
            } else {
                this.notificationProvider.notificationProvider = undefined;
                const secondReq = https.request(mailgunOptions, res => {
                    const {
                        statusCode: responseCode,
                        statusMessage: responseMsg
                    } = res;
                    if (responseCode === 200 || responseMsg === "OK") {
                        pickedMailgun = true;
                        console.log(`mailgun server OK .....\n`);
                        this.setNotificationServer(pickedMailgun, statusCode);
                    } else {
                        this.notificationProvider.notificationProvider = undefined;
                    }
                });
                secondReq.end();
            }
        });

        req.end();
    }

    setNotificationServer(pickMailgun, status) {
        let hasNotificationProvider = help.isEmpty(this.notificationProvider) && this.notificationProvider.getNotificationProvider();

        hasNotificationProvider ? this.notificationProvider.setStatus(status) : pickMailgun
                ? this.notificationProvider.setNotificationProvider(new MailGun(status))
                : this.notificationProvider.setNotificationProvider(new SendGrid(status));
    };
}

export default Worker;
