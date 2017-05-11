import DownloadedCourse from './DownloadedCourse';

export default class SaveFileEditor {

    constructor (appSavePath) {

        this.appSavePath = appSavePath;
        this.downloadedCourses = {};

    }

    setCemuSave (cemuSave) {

        this.cemuSave = cemuSave;

    }

    async download (onStart, onProgress, onFinish, courseId, courseName, ownerName, videoId) {

        try {
            this.downloadedCourses[courseId] = await (new DownloadedCourse(this.appSavePath)).download(onStart, onProgress, onFinish, courseId, courseName, ownerName, videoId);
        } catch (err) {
            throw err;
        }

    }

    async add (onFinish, courseId) {

        let success = false;
        try {
            let filePath = this.downloadedCourses[courseId].filePath;
            for (let i = 0; i < filePath.length; i++) {
                let newId = await this.cemuSave.addCourse(filePath[i]);
                await this.cemuSave.courses[`course${newId.pad(3)}`].exportJpeg();
            }
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