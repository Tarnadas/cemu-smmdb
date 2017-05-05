import request from 'request';

import fs from 'fs';
import path from 'path';

export default class CourseDownloader {
    constructor (courseId, courseName, ownerName, appSavePath) {
        let courseUrl = `http://smmdb.ddns.net/courses/${courseId}`;
        this.stream = fs.createWriteStream(path.join(appSavePath, courseId + '.comp'));

        this.req = request({
            method: 'GET',
            uri: courseUrl
        });
        this.req.pipe(this.stream);

        this.req.on('data', (chunk) => {
            console.log(chunk.length);
        });

        this.req.on('end', () => {
            //Do something
        });

        this.req.on('response', (data) => {
            console.log(data.headers['content-length']);
        });
    }
}