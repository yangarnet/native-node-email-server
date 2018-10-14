
import https from 'https';
import querystring from 'querystring';

class MailGun {
    constructor(status) {
        this.status = status;
    }

    send(email, cb) {
        const options = {
            "method": process.env.SEND_MAIL_METHOD,
            "hostname": process.env.MAILGUN_HOST_NAME,
            "path": process.env.MAILGUN_API_PATH,
            "headers": {
                "Content-Type": process.env.MAILGUN_REQ_CONTENT_TYPE,
                "Authorization": process.env.MAILGUN_AUTH
            }
        }

        const req = https.request(options, res => {
            const { statusCode, statusMessage } = res;
            if (statusCode === 200 || statusMessage === 'OK') {
                console.log('mailgun send email success');
                cb({statusCode, message: statusMessage});
            } else {
                cb({statusCode: 400, message: 'bad request'});
            }
        });

        req.write(querystring.stringify({
            from: process.env.MAINGUN_SANBOX,
            to: 'yangarnet@gmail.com',
            subject: 'yes',
            text: 'send you this'
         }))
        req.end();
    }

    setStatus(status) {
        this.status = status;
    }

    getStatus() {
        return this.status;
    }
}


export default MailGun;
