import { startDownloadCourse, progressDownloadCourse, finishDownloadCourse, finishAddCourse, finishDeleteCourse } from '../actions';

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
        let onDeleteFinish = (cemuSave, smmdbId, saveId, success) => {
            dispatch(finishDeleteCourse(cemuSave, smmdbId, saveId, success));
        };
        switch (action.type) {
            case 'DOWNLOAD_COURSE':
                saveFileEditor.download(onStart, onProgress, onFinish, action.courseId, action.courseName, action.ownerName, action.videoId);
                break;
            case 'ADD_COURSE':
                saveFileEditor.add(onAddFinish, action.courseId);
                break;
            case 'DELETE_COURSE':
                saveFileEditor.delete(onDeleteFinish, action.smmdbId, action.saveId);
                break;
        }
        return next(action);
    }
}