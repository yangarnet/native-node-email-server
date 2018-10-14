## The task

Create a a fullstack service to allow user send emails to their friends or clients.The application encapsultes a notification channel to provide fault tolerance, easy of scalability.

### Design

the Nodejs application has **NO dependency** on any 3rd party library, no npm pakcage can be found in this native Nodejs application, it provides powerful and fully function ability from backend to frontend. Backend implements the support from two email provider: **MailGun and SendGrid**, and in background, a worker thread is running in backround the check status of these email server, in case it is down, the system will switch to another active server beforre sending the notification to user. it implements one RESTful api end point to serve the email notification activity, and the system is easy scaled to support other notification such SMS and phone call. the System performs backend validation and gives user friendly feedback information on the front end side. it only support sending text format email currently but easily extend to support multi-media emal.

### Get the source code

open your terminal and do the following:

```
$git clone https://github.com/yangarnet/node-email-server.git
$node app.js  (you might not be able to start the app without api key)
```

### Prerequisites

To play the code in your local machine, you will need to setup a pair of API keys and other request options for both email providers. go and check the file _setting.json_
the format looks like the following:

```
        "MAILGUN_HOST_NAME": "",
        "MAILGUN_CHECK_PATH": "",
        "CHECK_PORT": 443,
        "MAILGUN_API_PATH": "",
        "MAILGUN_REQ_CONTENT_TYPE":"",
        "MAILGUN_AUTH":"",
        "MAINGUN_DOMNAIN": "",
        "MAINGUN_SANBOX": "",

        "SENDGRID_HOST_NAME":"",
        "SENDGRID_CHECK_PATH": "",
        "SENDGRID_API_PATH": "",
        "SENDGRID_AUTH": "",
        "SENDGRID_API_KEY":"",
        "SENDGRID_SANBOX": ""
```

once the settings are set, you will be able to start the application from your local

### Q&A

-   Q: when the system picks up mailgun as email provider, why some receipents do not receive email?
-   A: there is because you might not have custom DNS setup in your control panel, in some case , you might need to add authorize recipients to your domain
-   Q: where and how can I get the API key or authentication key for mailgun and sendgrid
-   A: you will need to register an account with them, and get your valid bank card on hand
-   Q: why did not receive email
-   A: you need to config add-ons (on heroku) for both send grid and mailgun, and you might to check other place like spam rather than only inbox

### what is missing

unit test is a must, no unit test was written for this app at the time commit the code change to github, will continue to work on this after

### deployment

the app is currently running on production with the following address:

[Node Email Server](https://my-node-email-server.herokuapp.com/)
