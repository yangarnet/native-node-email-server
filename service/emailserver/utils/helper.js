import fs from "fs";
import path from "path";
import url from "url";
import { StringDecoder } from "string_decoder";
import common from "../../common/helper";

const helper = {

    parseJsonObject(inputString) {
        try {
            const jsonResult = JSON.parse(inputString);
            return jsonResult;
        } catch (err) {
            return {};
        }
    },

    validateEmails(emails) {
        const emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let isValidAddress = true;
        emails.forEach(email => {
            if (!email.trim().match(emailformat)) {
                isValidAddress = false;
                return;
            }
        });

        return isValidAddress;
    },

    processEmailString(emails) {
        if (!common.isEmpty(emails) && emails.split(";").length >= 1) {
            return emails.split(";");
        }
        return [];
    },

    buildEmailObjArray(recipents) {
        return recipents.reduce((acc, recipent) => {
            acc.push({ email: recipent });
            return acc;
        }, []);
    },

    buildEmailRecipentList(to, cc, bcc) {
        const result = {};
        if (!common.isEmpty(to)) {
            result.to = to;
        }
        if (!common.isEmpty(cc)) {
            result.cc = cc;
        }
        if (!common.isEmpty(bcc)) {
            result.bcc = bcc;
        }
        return result;
    },

    isLoadingStaticResources(url) {
        return (
            url === "/" ||
            url.match(/.css$/) ||
            url.match(/.js$/) ||
            url.match(/.jpg$/)
        );
    },

    loadingStaticResouces(req, res) {
        if (req.url.trim() === "/") {
            fs.readFile(
                path.join(__dirname, "../../../public/index.html"),
                "UTF-8",
                (err, html) => {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(html);
                }
            );
        } else if (req.url.match(/.css$/)) {
            const csspath = path.join(
                __dirname,
                "../../../public/",
                req.url.trim()
            );
            const cssStream = fs.createReadStream(csspath, "UTF-8");
            res.writeHead(200, { "Content-Type": "text/css" });
            cssStream.pipe(res);
        } else if (req.url.match(/.js$/)) {
            const jspath = path.join(
                __dirname,
                "../../../public/",
                req.url.trim()
            );
            const jsStream = fs.createReadStream(jspath, "UTF-8");
            res.writeHead(200, { "Content-Type": "text/plain" });
            jsStream.pipe(res);
        } else if (req.url.match(/.jpg$/)) {
            const imgPath = path.join(
                __dirname,
                "../../../public/",
                req.url.trim()
            );
            const imgStream = fs.createReadStream(imgPath);
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            imgStream.pipe(res);
        } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 file not found");
        }
    },

    loadRequestPayload(req, res, routerConfig, handler) {
        const method = req.method.toLowerCase();
        const requestUrl = url.parse(req.url, true);
        const path = requestUrl.pathname;
        const trimmedPath = path.replace(/^\/+|\/+$/g, "");

        const decoder = new StringDecoder("UTF-8");
        let buffer = "";
        req.on("data", input => {
            buffer += decoder.write(input);
        });

        req.on("end", () => {
            buffer += decoder.end();

            const requestObject = {
                path: trimmedPath,
                method,
                payload: helper.parseJsonObject(buffer)
            };

            const selectedHandler =
                routerConfig[trimmedPath] !== undefined
                    ? routerConfig[trimmedPath]
                    : handler.notFound;

            selectedHandler(requestObject, (statusCode, response) => {
                const reqResult = JSON.stringify(response);
                res.writeHead(statusCode, {
                    "Content-Type": "application/json"
                });
                res.end(reqResult);
            });
        });
    }
};

export default helper;
