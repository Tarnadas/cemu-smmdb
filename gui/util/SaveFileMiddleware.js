import { startDownloadCourse, progressDownloadCourse, finishDownloadCourse, finishAddCourse, finishAddPackageCourse, finishDeleteCourse, finishDeletePackageCourse, finishOpenPackage } from '../actions';

export default function saveFileMiddleware (saveFileEditor) {
    return ({ dispatch, getState }) => next => action => {
        let onStart = (courseId, dataLength) => {
            dispatch(startDownloadCourse(courseId, dataLength));
        };
        let onProgress = (courseId, dataLength) => {
            dispatch(progressDownloadCourse(courseId, dataLength));
        };
        let onFinish = (courseId) => {
            dispatch(finishDownloadCourse(courseId));
        };
        let onAddFinish = (cemuSave, smmdbId, saveId, success) => {
            dispatch(finishAddCourse(cemuSave, smmdbId, saveId, success));
        };
        let onAddPackageFinish = (cemuSave, courseId, smmdbId, saveId, success) => {
            dispatch(finishAddPackageCourse(cemuSave, courseId, smmdbId, saveId, success));
        };
        let onDeleteFinish = (cemuSave, smmdbId, saveId, success) => {
            dispatch(finishDeleteCourse(cemuSave, smmdbId, saveId, success));
        };
        let onDeletePackageFinish = (cemuSave, smmdbId, courseId, saveId, success) => {
            dispatch(finishDeletePackageCourse(cemuSave, smmdbId, courseId, saveId, success));
        };
        let onOpenFinish = (coursePackage, packageName) => {
            dispatch(finishOpenPackage(coursePackage, packageName));
        };
        switch (action.type) {
            case 'DOWNLOAD_COURSE':
                saveFileEditor.downloadCourse(onStart, onProgress, onFinish, action.courseId, action.courseName, action.ownerName, action.videoId, action.courseType, action.modified);
                break;
            case 'ADD_COURSE':
                if (!!action.packageId) {
                    saveFileEditor.addPackageCourse(onAddPackageFinish, action.courseId, action.packageId);
                } else {
                    saveFileEditor.addCourse(onAddFinish, action.courseId);
                }
                break;
            case 'DELETE_COURSE':
                if (!!action.courseId) {
                    saveFileEditor.deletePackageCourse(onDeletePackageFinish, action.smmdbId, action.courseId, action.saveId);
                } else {
                    saveFileEditor.deleteCourse(onDeleteFinish, action.smmdbId, action.saveId);
                }
                break;
            case 'OPEN_PACKAGE':
                saveFileEditor.openPackage(onOpenFinish, getState().getIn(['appSaveData', 'downloads', ''+action.packageId]).toJS(), action.packageName);
                break;
        }
        return next(action);
    }
}