import Promise from 'bluebird';
import smm from 'cemu-smm';
import fileType from 'file-type';
import readChunk from 'read-chunk';
import { unzip } from 'cross-unzip';
import mv from 'mv';
import rimraf from 'rimraf';

let request = require('request');
if (process.env.NODE_ENV === 'development') {
    const throttle =  require('throttled-request');
    request = throttle(request);
    request.configure({
        requests: 1,
        milliseconds: 1000
    });
}

import fs from 'fs';
import path from 'path';

export default class DownloadedCourse {

    constructor (appSavePath) {
        this.appSavePath = appSavePath;
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
            if (mime !== 'application/x-rar-compressed' && mime !== 'application/zip' && mime !== 'application/x-7z-compressed') {
                throw new Error("Could not decompress file! Unknown format: " + mime)
            }

            // decompress
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
            this.filePath = await this.moveFiles();

            // fix thumbnails + maker + title
            let promises = [];
            for (let i = 0; i < this.filePath.length; i++) {
                promises.push(new Promise(async (resolve) => {
                    let course = await smm.loadCourse(this.filePath[i]);
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
                                    thumbnailPath = path.join(this.appSavePath, `temp/${courseId}_${i}.pic`);
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
                    resolve();
                }));
            }
            await Promise.all(promises);

            onFinish(courseId);
        });

        return this;

    }

    async moveFiles () {

        let courseFolders = [];
        let getCourseFolders = async (filePath) => {
            await new Promise((resolve) => {
                fs.readdir(filePath, null, async (err, files) => {
                    if (err) throw err;
                    for (let i = 0; i < files.length; i++) {
                        let isFolder = /^[^.]+$/.test(files[i]);
                        let isCourseFolder = /[c|C]ourse\d{3}$/.test(files[i]);
                        if (isCourseFolder) {
                            courseFolders.push(path.join(filePath, files[i]));
                        } else if (isFolder) {
                            await getCourseFolders(path.join(filePath, files[i]));
                        }
                    }


                    resolve();
                })
            })
        };
        await getCourseFolders(this.filePath);
        let isPackage = false;
        if (courseFolders.length > 1) {
            isPackage = true;
        }

        let returnFolders = [];
        for (let i = 0; i < courseFolders.length; i++) {
            let targetDir = isPackage ? path.join(this.filePath, `course${i.pad(3)}`) : this.filePath;
            await new Promise((resolve) => {
                fs.readdir(courseFolders[i], null, async (err, files) => {
                    let promises = [];
                    for (let j = 0; j < files.length; j++) {
                        promises.push(new Promise((resolve) => {
                            mv(path.join(courseFolders[i], files[j]), path.join(targetDir, files[j]), {mkdirp: true}, (err) => {
                                if (err) throw err;
                                resolve();
                            });
                        }));
                    }
                    await Promise.all(promises);
                    resolve();
                });
            });
            if (isPackage) {
                let split = courseFolders[i].split('\\');
                let folder = courseFolders[i].substr(0, courseFolders[i].length - split[split.length-1].length - 1);
                rimraf(folder, () => {});
                returnFolders.push(targetDir);
            } else {
                fs.rmdir(courseFolders[i], () => {});
                returnFolders.push(this.filePath);
            }
        }
        return returnFolders;

    }
}