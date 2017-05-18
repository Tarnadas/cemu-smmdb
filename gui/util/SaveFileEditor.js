import DownloadedCourse from './DownloadedCourse';

export default class SaveFileEditor {

    constructor (appSavePath, downloadedCourses) {

        this.appSavePath = appSavePath;
        this.downloadedCourses = !!downloadedCourses ? downloadedCourses : {};

    }

    setCemuSave (cemuSave) {

        this.cemuSave = cemuSave;

    }

    async download (onStart, onProgress, onFinish, smmdbId, courseName, ownerName, videoId) {

        try {
            this.downloadedCourses[smmdbId] = await (new DownloadedCourse(this.appSavePath)).download(onStart, onProgress, onFinish, smmdbId, courseName, ownerName, videoId);
        } catch (err) {
            throw err;
        }

    }

    async add (onFinish, smmdbId) {

        let success = false, saveId = -1;
        try {
            let filePath = this.downloadedCourses[smmdbId].filePath;
            for (let i = 0; i < filePath.length; i++) {
                saveId = await this.cemuSave.addCourse(filePath[i]);
                await this.cemuSave.courses[`course${saveId.pad(3)}`].exportJpeg();
                this.downloadedCourses[smmdbId].addedToSave = true;
            }
            success = true;
        } catch (err) {
            console.log(err);
        }
        onFinish(this.cemuSave, smmdbId, saveId, success);

    }

    async delete (onFinish, smmdbId, saveId) {

        let success = false;
        try {
            await this.cemuSave.deleteCourse(saveId);
            success = true;
        } catch (err) {
            console.log(err);
        }
        onFinish(this.cemuSave, smmdbId, saveId, success);

    }

}

Number.prototype.pad = function(size) {
    let s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
};