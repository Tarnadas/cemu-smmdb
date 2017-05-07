import Promise from 'bluebird';
import request from 'request';
import throttle from 'throttled-request';
import fileType from 'file-type';
import readChunk from 'read-chunk';
import AdmZip from 'adm-zip';
import Unrar from 'node-unrar';
import { unzip } from 'cross-unzip';
import mv from 'mv';
import rimraf from 'rimraf';

let throttledRequest = throttle(request);
throttledRequest.configure({
    requests: 1,
    milliseconds: 1000
});

import fs from 'fs';
import path from 'path';

export default class CourseDownloader {
    constructor (appSavePath) {
        this.appSavePath = appSavePath;
    }
    download (onStart, onProgress, onFinish, courseId, courseName, ownerName) {
        if (!fs.existsSync(path.join(this.appSavePath, 'temp'))){
            fs.mkdirSync(path.join(this.appSavePath, 'temp'));
        }
        if (!fs.existsSync(path.join(this.appSavePath, 'downloads'))){
            fs.mkdirSync(path.join(this.appSavePath, 'downloads'));
        }

        let courseUrl = `http://smmdb.ddns.net/courses/${courseId}`;
        this.filePathTemp = path.join(this.appSavePath, `temp/${courseId}`);
        this.filePath = path.join(this.appSavePath, `downloads/${courseId}`);
        this.stream = fs.createWriteStream(this.filePathTemp);

        this.req = throttledRequest({
            method: 'GET',
            uri: courseUrl
        });
        this.req.pipe(this.stream);

        this.req.on('response', (data) => {
            onStart(courseId, parseInt(data.headers['content-length']));
        });

        this.req.on('data', (chunk) => {
            onProgress(courseId, chunk.length);
        });

        this.req.on('end', async () => {
            let mime = fileType(readChunk.sync(this.filePathTemp, 0, 4100)).mime;
            if (mime === 'application/x-rar-compressed') {

                let rarName = path.join(this.appSavePath, `temp/${courseId}.rar`);
                if (fs.existsSync(rarName)) {
                    fs.unlinkSync(rarName);
                }
                fs.renameSync(this.filePathTemp, rarName);
                this.filePathTemp = rarName;
                await new Promise((resolve) => {
                    rimraf(this.filePath, () => {
                        fs.mkdirSync(this.filePath);
                        resolve();
                    })
                });

                let rar = new Unrar(this.filePathTemp);
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
                            fs.rmdir(mvFilePath, () => {});
                        }
                    })
                });

            } else if (mime === 'application/zip') {

                await new Promise((resolve) => {
                    rimraf(this.filePath, () => {
                        fs.mkdirSync(this.filePath);
                        resolve();
                    })
                });

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
                        fs.rmdir(mvFilePath, () => {});
                    }
                })

            } else if (mime === 'application/x-7z-compressed') {

                await new Promise((resolve) => {
                    rimraf(this.filePath, () => {
                        fs.mkdirSync(this.filePath);
                        resolve();
                    })
                });

                await new Promise((resolve) => {
                    unzip(this.filePathTemp, this.filePath, (err) => {
                        if (err) console.log(err);
                        fs.unlink(this.filePathTemp, () => {});
                        resolve();
                    });
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
                        fs.rmdir(mvFilePath, () => {});
                    }
                })

            } else {
                console.log("Could not decompress file. Unknown format! " + mime)
            }
            onFinish(courseId);
        });
    }
}