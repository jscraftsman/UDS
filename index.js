/* jshint esversion: 6 */

(() => {
    'use strict';

    const VERSION = "v1.0.0";
    const PORT = 3000;
    const BASE_FOLDER = 'videos';

    const fs = require('fs');
    const request = require('request');
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();


    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    app.use(setCORS);

    app.post('/extract', handleExtractRoute);

    app.listen(PORT, () => {
        console.log(`Udemy Extractor (v${VERSION}) running on port ${PORT}!`);
    });

    function DOWNLOAD(uri, filename, callback) {
        request.head(uri, function(err, res, body) {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    }

    function handleExtractRoute(req, res) {
        let order = req.body.order;
        let title = req.body.title;
        let url = req.body.url;

        console.log(`Downloading video:\n\tOrder: ${order}\n\tTitle: ${title}\n\tUrl: ${url}`);

        console.log('Please wait...');

        order = order.replace(':', ' - ');
        order = order.replace('?', '');
        title = title.replace(':', ' - ');
        title = title.replace('/', '-');
		title = title.replace('?', '');
        
        let filePath = `${BASE_FOLDER}/${order} - ${title}.mp4`;
        DOWNLOAD(url, filePath, () => {
            console.log(`\n[DONE] Downloaded: ${filePath}`);
            res.send('DONE');
        });
    }

    function setCORS(req, res, next) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'https://www.udemy.com');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET POST');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    }

})();