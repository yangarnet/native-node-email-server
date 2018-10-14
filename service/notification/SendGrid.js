import https from 'https';
import helper from '../emailserver/utils/helper';

class SendGrid {

    constructor(status) {
        this.status = status;
    }

    send(email, cb) {
        const sendgridOptions = {
            method: process.env.SEND_MAIL_METHOD,
            hostname: process.env.SENDGRID_HOST_NAME,
            path: process.env.SENDGRID_API_PATH,
            headers: {
                Authorization: process.env.SENDGRID_AUTH,
                "Content-Type": process.env.TYPE_JSON
            }
        };

        const req = https.request(sendgridOptions, res => {
            const { statusCode, statusMessage } = res;
            if (statusCode === 202 || statusMessage === "Accepted") {
                console.log("send grid send email success");
                cb({ statusCode, message: statusMessage });
            } else {
                cb({ statusCode: 400, message: "bad request" });
            }
        });

        let {
            subject,
            text,
            to: recipents,
            cc: ccRecipents,
            bcc: bccRecipents
        } = email;
        recipents = helper.processEmailString(recipents);
        ccRecipents = helper.processEmailString(ccRecipents);
        bccRecipents = helper.processEmailString(bccRecipents);

        to = helper.buildEmailObjArray(recipents);
        cc = helper.buildEmailObjArray(ccRecipents);
        bcc = helper.buildEmailObjArray(bccRecipents);
        const recipentsList = helper.buildEmailRecipentList(to, cc, bcc);

        req.write(
            JSON.stringify({
                personalizations: [{ ...recipentsList }],
                from: { email: process.env.SENDGRID_SANBOX },
                subject,
                content: [{ type: process.env.TYPE_TEXT, value: text }]
            })
        );
        req.end();
    }

    setStatus(status) {
        this.status = status;
    }

    getStatus() {
        return this.status;
    }
}

export default SendGrid;
