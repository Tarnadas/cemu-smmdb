import { loadCourse } from 'cemu-smm'

import DownloadedCourse from './DownloadedCourse';

export default class SaveFileEditor {

    constructor (appSavePath, downloadedCourses) {

        this.appSavePath = appSavePath;
        this.downloadedCourses = !!downloadedCourses ? downloadedCourses : {};

    }

    setCemuSave (cemuSave) {

        this.cemuSave = cemuSave;

    }

    async downloadCourse (onStart, onProgress, onFinish, smmdbId, courseName, ownerName, videoId, courseType, modified) {

        try {
            this.downloadedCourses[smmdbId] = await (new DownloadedCourse(this.appSavePath)).download(onStart, onProgress, onFinish, smmdbId, courseName, ownerName, videoId, courseType, modified);
        } catch (err) {
            throw err;
        }

    }

    async addCourse (onFinish, smmdbId) {

        let success = false, saveId = -1;
        try {
            let filePath = this.downloadedCourses[smmdbId].filePath;
            saveId = await this.cemuSave.addCourse(filePath[0]);
            await this.cemuSave.courses[`course${saveId.pad(3)}`].exportJpeg();
            this.downloadedCourses[smmdbId].addedToSave = true;
            success = true;
        } catch (err) {
            success = false;
        }
        onFinish(this.cemuSave, smmdbId, saveId, success);

    }

    async addPackageCourse (onFinish, courseId, smmdbId) {

        let success = false, saveId = -1;
        try {
            let filePath = this.downloadedCourses[smmdbId].filePath;
            saveId = await this.cemuSave.addCourse(filePath[courseId]);
            //await this.cemuSave.courses[`course${saveId.pad(3)}`].exportJpeg();
            this.downloadedCourses[smmdbId].addedToSave[courseId] = true;
            success = true;
        } catch (err) {
            success = false;
        }
        onFinish(this.cemuSave, courseId, smmdbId, saveId, success);

    }

    async deleteCourse (onFinish, smmdbId, saveId) {

        let success = false;
        try {
            await this.cemuSave.deleteCourse(saveId);
            success = true;
        } catch (err) {
            console.log(err);
        }
        onFinish(this.cemuSave, smmdbId, saveId, success);

    }

    async deletePackageCourse (onFinish, smmdbId, courseId, saveId) {

        let success = false;
        try {
            await this.cemuSave.deleteCourse(saveId);
            success = true;
        } catch (err) {
            console.log(err);
        }
        onFinish(this.cemuSave, smmdbId, courseId, saveId, success);

    }

    async openPackage (onOpenFinish, coursePackage, packageName) {

        let courses = [];
        for (let i = 0; i < coursePackage.filePath.length; i++) {
            courses.push(await loadCourse(coursePackage.filePath[i], coursePackage.smmdbId));
            await courses[i].exportJpeg();
        }
        onOpenFinish(courses, packageName);

    }

}

Number.prototype.pad = function(size) {
    let s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
};