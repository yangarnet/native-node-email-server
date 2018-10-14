import http from 'http';
import fs from 'fs';
import path from 'path';
import router from './router';

const server = {
    init() {
        const httpServer = http.createServer((req, res) => {
            router(req, res);
        });
        httpServer.listen(process.env.PORT, () => {
            console.log(`the server running @ port ${process.env.PORT}`);
        });
    }
};

export default server;
