import Promise from 'bluebird';
import smm from 'cemu-smm';
import fileType from 'file-type';
import readChunk from 'read-chunk';
import AdmZip from 'adm-zip';
import Unrar from 'node-unrar';
import { unzip } from 'cross-unzip';
import mv from 'mv';
import rimraf from 'rimraf';
import copydir from 'copy-dir';

import fs from 'fs';
import path from 'path';

let request = require('request');
if (process.env.NODE_ENV === 'development') {
    const throttle =  require('throttled-request');
    request = throttle(request);
    request.configure({
        requests: 1,
        milliseconds: 1000
    });
}

export default class CourseDownloader {

    constructor (appSavePath) {
        this.appSavePath = appSavePath;
    }

    setCemuSave (cemuSave) {
        this.cemuSave = cemuSave;
    }

    download (onStart, onProgress, onFinish, courseId, courseName, ownerName, videoId) {

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

        this.req = request({
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
                await new Promise((resolve) => {
                    rar.extract(this.filePath, null, async (err) => {
                        if (err) throw err;
                        fs.unlink(this.filePathTemp, () => {});

                        // move files to proper directory
                        await new Promise((resolve) => {
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
                                resolve();
                            })
                        });
                        resolve();
                    })
                })

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
                await new Promise((resolve) => {
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
                        resolve();
                    })
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
                        if (err) throw err;
                        fs.unlink(this.filePathTemp, () => {});
                        resolve();
                    });
                });

                // move files to proper directory
                await new Promise((resolve) => {
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
                        resolve();
                    })
                })

            } else {
                throw new Error("Could not decompress file! Unknown format: " + mime)
            }
            let course = await smm.loadCourse(this.filePath);
            if (await course.isThumbnailBroken()) {
                let isFixed = false, iteration = 0, thumbnailPath = null;
                let thumbnailUrl = `http://smmdb.ddns.net/img/courses/thumbnails/${courseId}.pic`;
                while (!isFixed && iteration < 2) {
                    try {
                        isFixed = await new Promise((resolve) => {
                            let thumbnailReq = request({
                                method: 'GET',
                                uri: thumbnailUrl
                            });
                            thumbnailPath = path.join(this.appSavePath, `temp/${courseId}.pic`);
                            let thumbnailStream = fs.createWriteStream(thumbnailPath);
                            thumbnailReq.pipe(thumbnailStream);
                            thumbnailReq.on('response', (data) => {
                                if (data.statusCode === 404) {
                                    thumbnailPath = null;
                                    resolve(false);
                                }
                            });
                            thumbnailReq.on('end', () => {
                                resolve(true);
                            });
                        });
                        if (!isFixed) {
                            if (!videoId) {
                                if (process.env.NODE_ENV === 'development') {
                                    thumbnailPath = './build/assets/images/icon_large.png';
                                } else {
                                    thumbnailPath = './resources/app/assets/images/icon_large.png';
                                }
                                isFixed = true;
                            } else {
                                thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                            }
                        }
                    } catch (err) {
                        isFixed = true;
                    }
                    iteration++;
                }
                if (!!thumbnailPath) {
                    await course.setThumbnail(thumbnailPath);
                }
            }
            course.setMaker(ownerName, false);
            course.setTitle(courseName, false);
            await course.writeCrc();
            onFinish(courseId);
        });

    }

    async add (onFinish, courseId) {

        let success = false;
        try {
            let newId = await this.cemuSave.addCourse(this.filePath);
            await this.cemuSave.courses[`course${newId.pad(3)}`].exportJpeg();
            success = true;
        } catch (err) {
            console.log(err);
        }
        onFinish(this.cemuSave, courseId, success);

    }

    async delete (onFinish, courseId) {

        let success = false;
        try {
            await this.cemuSave.deleteCourse(courseId);
            success = true;
        } catch (err) {
            console.log(err);
        }
        onFinish(this.cemuSave, courseId, success);

    }

}

Number.prototype.pad = function(size) {
    let s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
};