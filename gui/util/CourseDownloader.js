import Promise from 'bluebird';
import request from 'request';
import throttle from 'throttled-request';
import fileType from 'file-type';
import readChunk from 'read-chunk';
import AdmZip from 'adm-zip';
import Unrar from 'node-unrar';
import {unzip} from 'cross-unzip';
import mv from 'mv';

let throttledRequest = throttle(request);
throttledRequest.configure({
    requests: 1,
    milliseconds: 1000
});

import fs from 'fs';
import path from 'path';

export default class CourseDownloader {
    constructor (courseId, courseName, ownerName, appSavePath) {
        if (!fs.existsSync(path.join(appSavePath, 'temp'))){
            fs.mkdirSync(path.join(appSavePath, 'temp'));
        }
        if (!fs.existsSync(path.join(appSavePath, 'downloads'))){
            fs.mkdirSync(path.join(appSavePath, 'downloads'));
        }

        let courseUrl = `http://smmdb.ddns.net/courses/${courseId}`;
        this.filePathTemp = path.join(appSavePath, `temp/${courseId}`);
        this.filePath = path.join(appSavePath, `downloads/${courseId}`);
        this.stream = fs.createWriteStream(this.filePathTemp);

        this.req = throttledRequest({
            method: 'GET',
            uri: courseUrl
        });
        this.req.pipe(this.stream);

        this.req.on('response', (data) => {
            //console.log("length: " + data.headers['content-length']);
        });

        this.req.on('data', (chunk) => {
            //console.log("chunk received: " + chunk.length);
        });

        this.req.on('end', async () => {
            let mime = fileType(readChunk.sync(this.filePathTemp, 0, 4100)).mime;
            if (mime === 'application/x-rar-compressed') {

                fs.renameSync(this.filePathTemp, path.join(appSavePath, `temp/${courseId}.rar`));
                this.filePathTemp = path.join(appSavePath, `temp/${courseId}.rar`);
                let rar = new Unrar(this.filePathTemp);
                if (!fs.existsSync(this.filePath)){
                    fs.mkdirSync(this.filePath);
                }
                rar.extract(this.filePath, null, (err) => {
                    if (err) console.log(err);
                    fs.unlink(this.filePathTemp, () => {});

                    // move files to proper directory
                    fs.readdir(this.filePath, null, async (err, files) => {
                        if (err) throw err;
                        if (files.length === 1) {
                            let mvFilePath = path.join(this.filePath, files[0]);
                            await new Promise((resolve) => {
                                fs.readdir(mvFilePath, null, async (err, files) => {
                                    let promises = [];
                                    for (let i = 0; i < files.length; i++) {
                                        promises.push(new Promise((resolve) => {
                                            mv(path.join(mvFilePath, files[i]), path.join(this.filePath, files[i]), {mkdirp: true}, (err) => {
                                                if (err) throw err;
                                                resolve();
                                            });
                                        }));
                                    }
                                    await Promise.all(promises);
                                    resolve();
                                });
                            });
                            fs.rmdir(mvFilePath);
                        }
                    })
                });

            } else if (mime === 'application/zip') {

                // uncompress and delete temp file
                let zip = new AdmZip(this.filePathTemp);
                zip.extractAllTo(this.filePath, true);
                fs.unlink(this.filePathTemp, () => {});

                // move files to proper directory
                fs.readdir(this.filePath, null, async (err, files) => {
                    if (err) throw err;
                    if (files.length === 1) {
                        let mvFilePath = path.join(this.filePath, files[0]);
                        await new Promise((resolve) => {
                            fs.readdir(mvFilePath, null, async (err, files) => {
                                let promises = [];
                                for (let i = 0; i < files.length; i++) {
                                    promises.push(new Promise((resolve) => {
                                        mv(path.join(mvFilePath, files[i]), path.join(this.filePath, files[i]), {mkdirp: true}, (err) => {
                                            if (err) throw err;
                                            resolve();
                                        });
                                    }));
                                }
                                await Promise.all(promises);
                                resolve();
                            });
                        });
                        fs.rmdir(mvFilePath);
                    }
                })

            } else if (mime === 'application/x-7z-compressed') {

                if (!fs.existsSync(this.filePath)){
                    fs.mkdirSync(this.filePath);
                }
                unzip(this.filePathTemp, this.filePath, (err) => {
                    if (err) console.log(err);
                    fs.unlink(this.filePathTemp, () => {});
                });

                // move files to proper directory
                fs.readdir(this.filePath, null, async (err, files) => {
                    if (err) throw err;
                    if (files.length === 1) {
                        let mvFilePath = path.join(this.filePath, files[0]);
                        await new Promise((resolve) => {
                            fs.readdir(mvFilePath, null, async (err, files) => {
                                let promises = [];
                                for (let i = 0; i < files.length; i++) {
                                    promises.push(new Promise((resolve) => {
                                        mv(path.join(mvFilePath, files[i]), path.join(this.filePath, files[i]), {mkdirp: true}, (err) => {
                                            if (err) throw err;
                                            resolve();
                                        });
                                    }));
                                }
                                await Promise.all(promises);
                                resolve();
                            });
                        });
                        fs.rmdir(mvFilePath);
                    }
                })

            } else {
                console.log("Could not decompress file. Unknown format! " + mime)
            }
        });
    }
}