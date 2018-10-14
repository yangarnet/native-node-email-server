
import helper from'./utils/helper';
import common from '../common/helper';
import NotificationProvider from '../notification/NotificationProvider';

const handler = {

    email(data, callback) {
        const acceptedMethods = ['post'];
        if (acceptedMethods.indexOf(data.method) > -1) {
            handler.emailAction[data.method](data, callback);
        } else {
            callback(400);
        }
    },

    notFound(data, callback) {
        callback(404, {Error: `request path not found: ${data.path}`});
    },

    post(data, callback) {
        const { to, cc, bcc, subject, text } = data.payload;
        let isValidToAddress = !common.isEmpty(to) && helper.validateEmails(to.split(';'));
        let isValidCCAddress = common.isEmpty(cc) || (!common.isEmpty(cc) && helper.validateEmails(cc.split(';'))) ;
        let isValidBCCAddress = common.isEmpty(bcc) || (!common.isEmpty(bcc) && helper.validateEmails(bcc.split(';')));
        let isValidSubject = !common.isEmpty(subject);
        let isValidText = !common.isEmpty(text);
        if (isValidToAddress && isValidCCAddress && isValidBCCAddress && isValidSubject && isValidText) {
            const notificationProvider = NotificationProvider.getNotificationProvider();
            notificationProvider.notify(data.payload, response => {
                if (response.statusCode === 200 || response.statusCode === 202) {
                    callback(response.statusCode, {Success: 'Success'});
                } else {
                    callback(response.statusCode, {Error: 'Error'})
                }
            });
        } else {
            const errors = {};
            if (!isValidSubject) {
                errors.subject = "email subject is required";
            }
            if (!isValidText) {
                errors.comments = "reviews cannot be empty";
            }
            if (!isValidToAddress) {
                errors.toemail = 'errors in to email address';
            }
            if (!isValidCCAddress) {
                errors.ccemail = 'errors in cc email address';
            }
            if (!isValidBCCAddress) {
                errors.bccemail = 'errors in bcc email address';
            }
            callback(400, errors);
        }

    }
};

export default handler;
